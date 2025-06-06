const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const config = require('../config/dbConfig');
const router = express.Router();
const mongoose = require('mongoose');
const {MongoClient} = require('mongodb');
const {BSON} = require('bson');
const {validateDatabaseSchema} = require('../schemas/databaseSchemas');

const upload = multer({
    dest: 'uploads/',
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

// Helper pour trouver l'URI Mongo selon la base
function getDbUri(dbName) {
    const dbConfig = config.databases.find(d => d.name === dbName);
    return dbConfig ? dbConfig.uri : null;
}

// Extracteur shell-like : db.<collection>.<operation>(arg1, argN)
// FONCTION DE PARSING réutilisable 
function parseQuery(queryString) {
    let match = queryString.match(/^db\.(\w+)\.find\((.*)\)(\.sort\((.*)\))?$/);
    if (match) {
        const collection = match[1];
        const filter = match[2] ? eval('(' + match[2] + ')') : {};
        const sort = match[4] ? eval('(' + match[4] + ')') : undefined;
        return {type: 'find', collection, filter, sort};
    }
    match = queryString.match(/^db\.(\w+)\.aggregate\((\[.*\])\)$/s);
    if (match) {
        const collection = match[1];
        let pipeline = null;
        try {
            pipeline = eval(match[2]);
        } catch (e) {
            pipeline = [];
        }
        return {type: 'aggregate', collection, pipeline};
    }
    return null;
}

// Fonction pour récupérer les données d'une base 
const getDatabaseData = async (databaseName) => {
    try {
        // Chercher d'abord dans le dossier data
        const dataPath = path.join(__dirname, '..', 'data', `${databaseName}.js`);
        if (fs.existsSync(dataPath)) {
            return require(dataPath);
        }

        // Sinon chercher dans le dossier json
        const jsonPath = path.join(__dirname, '..', '..', 'json', `${databaseName}_db.questions.json`);
        if (fs.existsSync(jsonPath)) {
            const jsonContent = fs.readFileSync(jsonPath, 'utf8');
            return JSON.parse(jsonContent);
        }

        throw new Error(`Base de données ${databaseName} non trouvée`);
    } catch (error) {
        throw new Error(`Erreur lors de la lecture de la base de données: ${error.message}`);
    }
};

mongoose.connect('mongodb://localhost:27017/automotive_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

/**
 * @swagger
 * /api/database:
 *   get:
 *     tags:
 *       - Database
 *     summary: Liste les bases de données disponibles
 *     description: Récupère la liste des bases de données configurées
 *     responses:
 *       200:
 *         description: Liste des bases de données
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 */
router.get('/', async (req, res) => {
    try {
        const databases = config.databases.map(db => ({
            name: db.name,
            description: db.description
        }));
        console.log('Bases de données disponibles:', databases);
        res.json(databases);
    } catch (error) {
        console.error('Erreur lors de la récupération des bases de données:', error);
        res.status(500).json({
            error: "Erreur lors de la récupération des bases de données",
            details: error.message
        });
    }
});

// Liste des bases de données disponibles
router.get('/list', async (req, res) => {
    try {
        const databases = [];

        // Lire les bases depuis le dossier data
        const dataDir = path.join(__dirname, '..', 'data');
        const dataFiles = fs.readdirSync(dataDir);
        dataFiles.forEach(file => {
            if (file.endsWith('.js')) {
                databases.push(file.replace('.js', ''));
            }
        });

        // Lire les bases depuis le dossier json  
        const jsonDir = path.join(__dirname, '..', '..', 'json');
        if (fs.existsSync(jsonDir)) {
            const jsonFiles = fs.readdirSync(jsonDir);
            jsonFiles.forEach(file => {
                if (file.endsWith('_db.questions.json')) {
                    const dbName = file.replace('_db.questions.json', '');
                    if (!databases.includes(dbName)) {
                        databases.push(dbName);
                    }
                }
            });
        }

        res.json({
            success: true,
            databases
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Récupérer la liste des collections MongoDB pour une base précise
router.get('/:dbName/collections', async (req, res) => {
    try {
        const {dbName} = req.params;
        const db = mongoose.connection.useDb(dbName, {useCache: true});
        const collections = await db.db.listCollections().toArray();
        // Filtre: ignore "questions" ou autre
        const filtered = collections
            .filter(c => c.name !== "questions")
            .map(c => c.name);
        res.json(filtered);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

// Récupérer le contenu d'une collection MongoDB sous format JSON
router.get('/:dbName/collections/:collName', async (req, res) => {
    try {
        const {dbName, collName} = req.params;
        const db = mongoose.connection.useDb(dbName, {useCache: true});
        const data = await db.collection(collName).find({}).limit(100).toArray();
        res.json(data);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

router.post('/execute', async (req, res) => {
    const {dbName, shellQuery} = req.body;
    const uri = 'mongodb://localhost:27017';
    const client = new MongoClient(uri);

    try {
        console.log('Requête reçue:', {dbName, shellQuery});

        const parsed = parseQuery(shellQuery);
        if (!parsed) {
            return res.status(400).json({error: 'Format de requête invalide'});
        }

        await client.connect();
        const db = client.db(dbName + "_db");

        let result;
        if (parsed.type === 'find') {
            let cursor = db.collection(parsed.collection).find(parsed.filter);
            if (parsed.sort) cursor = cursor.sort(parsed.sort);
            result = await cursor.toArray();
        } else if (parsed.type === 'aggregate') {
            result = await db.collection(parsed.collection).aggregate(parsed.pipeline).toArray();
        }

        console.log("Resultat: ", result);
        res.json({data: result});
    } catch (error) {
        console.error('Erreur dans /execute:', error);
        res.status(500).json({error: 'Erreur interne du serveur'});
    } finally {
        await client.close();
    }
});

// Import d'une base de données
router.post('/import', upload.single('database'), async (req, res) => {
    const client = new MongoClient('mongodb://localhost:27017');

    try {
        const file = req.file;
        const format = req.body.format || 'json';
        let database;

        // Lecture du fichier selon le format
        try {
            const content = fs.readFileSync(file.path, 'utf8');
            database = JSON.parse(content);
        } catch (error) {
            throw new Error(`Erreur de parsing du fichier : ${error.message}`);
        }

        // Validation du schéma
        const isValid = validateDatabaseSchema(database);
        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: 'Le fichier ne respecte pas le schéma requis'
            });
        }

        // Connexion à MongoDB et import des données
        await client.connect();
        const dbName = `${database.name}_db`;
        const db = client.db(dbName);

        // Créer les collections et insérer les données
        for (const [collName, data] of Object.entries(database.collections)) {
            const documents = Array.isArray(data) ? data : [data];
            if (documents.length > 0) {
                await db.collection(collName).insertMany(documents);
            }
        }

        // Stocker les questions
        if (database.questions && database.questions.length > 0) {
            await db.collection('questions').insertMany(database.questions);
        }

        // Stocker l'ID de la session
        const sessionId = new mongoose.Types.ObjectId();
        await db.collection('sessions').insertOne({
            _id: sessionId,
            dbName: dbName,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
        });

        res.json({
            success: true,
            database: database.name,
            sessionId: sessionId.toString()
        });

    } catch (error) {
        console.error('Erreur lors de l\'import:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    } finally {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        await client.close();
    }
});

// IMPORT depuis JSON/BSON
router.post('/import/:db/:difficulty', upload.single('file'), async (req, res) => {
    const dbName = req.params.db;
    const uri = getDbUri(dbName);

    if (!uri) return res.status(400).json({error: 'Database not found'});
    if (!req.file) return res.status(400).json({error: 'No file uploaded'});

    const ext = path.extname(req.file.originalname).toLowerCase();

    try {
        const client = new MongoClient(uri, config.mongodb.options);
        await client.connect();
        const db = client.db();

        const data = fs.readFileSync(req.file.path);
        let docs;
        if (ext === '.json') {
            docs = JSON.parse(data.toString());
        } else if (ext === '.bson') {
            // Pour BSON, nécessite la lib 'bson'
            docs = BSON.deserialize(data);
        } else {
            return res.status(400).json({error: 'Invalid file type'});
        }

        await db.collection('questions').insertMany(Array.isArray(docs) ? docs : [docs]);

        client.close();
        res.json({success: true});
    } catch (e) {
        res.status(500).json({error: e.message});
    } finally {
        fs.unlinkSync(req.file.path);
    }
});

// Export d'une base de données  
router.get('/export/:database/:format', async (req, res) => {
    try {
        const {database, format} = req.params;

        // Récupération des données
        const data = await getDatabaseData(database);

        if (format === 'json') {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Content-Disposition', `attachment; filename=${database}_export.json`);
            res.json(data);
        } else if (format === 'bson') {
            const bsonData = BSON.serialize(data);
            res.setHeader('Content-Type', 'application/bson');
            res.setHeader('Content-Disposition', `attachment; filename=${database}_export.bson`);
            res.send(Buffer.from(bsonData));
        } else {
            throw new Error('Format non supporté');
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Route pour nettoyer la base de données
router.delete('/cleanup/:sessionId', async (req, res) => {
    const client = new MongoClient('mongodb://localhost:27017');

    try {
        await client.connect();
        const adminDb = client.db('admin');

        // Trouver la session
        const session = await adminDb.collection('sessions').findOne({
            _id: new mongoose.Types.ObjectId(req.params.sessionId)
        });

        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'Session non trouvée'
            });
        }

        // Supprimer la base de données
        await client.db(session.dbName).dropDatabase();

        // Supprimer la session
        await adminDb.collection('sessions').deleteOne({
            _id: session._id
        });

        res.json({
            success: true,
            message: 'Base de données nettoyée avec succès'
        });

    } catch (error) {
        console.error('Erreur lors du nettoyage:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    } finally {
        await client.close();
    }
});

module.exports = router;