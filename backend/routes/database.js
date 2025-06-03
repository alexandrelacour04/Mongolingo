const express = require('express');
const fs = require('fs');
const path = require('path');
const config = require('../config/dbConfig');
const router = express.Router();
const mongoose = require('mongoose');
const {MongoClient} = require('mongodb');

// Extracteur shell-like : db.<collection>.<operation>(arg1, argN)
function parseMongoShell(shellQuery) {
    const regex = /^db\.(\w+)\.(\w+)\((.*)\)$/s;
    const match = shellQuery.trim().match(regex);
    if (!match) throw new Error("Syntaxe MongoShell invalide");

    const [, collection, operation, argsRaw] = match;
    const args = [];
    let stack = [], arg = '', inQuote = false;
    for (let c of argsRaw.trim()) {
        if (c === '"' || c === "'") inQuote = !inQuote;
        if (!inQuote && (c === '{' || c === '[')) stack.push(c);
        if (!inQuote && (c === '}' && stack[stack.length - 1] === '{')) stack.pop();
        if (!inQuote && (c === ']' && stack[stack.length - 1] === '[')) stack.pop();
        if (!inQuote && stack.length === 0 && c === ',') {
            if (arg.trim()) args.push(arg.trim());
            arg = '';
        } else {
            arg += c;
        }
    }
    if (arg.trim()) args.push(arg.trim());

    const jsonArgs = args.map(a => {
        try {
            return JSON.parse(a);
        } catch {
            return a;
        }
    });

    return {collection, operation, args: jsonArgs};
}

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

module.exports = router;