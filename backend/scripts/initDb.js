const mongoose = require('mongoose');
const config = require('../config/dbConfig');
const libraryData = require('../data/library');
const automotiveData = require('../data/automotive');
const eventsData = require('../data/events');

const dataMapping = {
    'library': libraryData,
    'automotive': automotiveData,
    'events': eventsData
};

async function connectToDatabase(uri) {
    try {
        const connection = await mongoose.createConnection(uri);
        console.log(`Connecté à ${uri}`);
        return connection;
    } catch (error) {
        console.error(`Erreur de connexion à ${uri}:`, error);
        throw error;
    }
}

async function initializeCollections(connection, collections) {
    for (const [name, data] of Object.entries(collections)) {
        const collection = connection.collection(name);
        await collection.deleteMany({});
        if (data.length > 0) {
            await collection.insertMany(data);
            console.log(`Collection ${name} initialisée avec ${data.length} documents`);
        }
    }
}

async function initializeQuestions(connection, questions, dbName) {
    try {
        console.log(`Initialisation des questions pour ${dbName}`);

        // Définir le schema pour cette connexion
        const questionSchema = new mongoose.Schema({
            difficulty: {type: String, required: true},
            question: {type: String, required: true},
            expectedQuery: {type: String, required: true},
            hints: {type: [String], default: []},
            points: {type: Number, required: true},
            database: {type: String, required: true}
        });

        const QuestionModel = connection.model('Question', questionSchema);

        // Supprimer les questions existantes
        await QuestionModel.deleteMany({});
        console.log(`Questions existantes supprimées pour ${dbName}`);

        const questionsWithDb = questions.map(q => ({
            ...q,
            database: dbName
        }));

        const result = await QuestionModel.insertMany(questionsWithDb);
        console.log(`${result.length} questions insérées pour ${dbName}`);
    } catch (error) {
        console.error(`Erreur lors de l'initialisation des questions pour ${dbName}:`, error);
        throw error;
    }
}

async function initializeDatabase() {
    try {
        console.log('Début de l\'initialisation des bases de données...');

        for (const db of config.databases) {
            console.log(`\nInitialisation de ${db.name}...`);
            const connection = await connectToDatabase(db.uri);
            const data = dataMapping[db.name];

            if (!data) {
                console.error(`Pas de données trouvées pour ${db.name}`);
                continue;
            }

            await initializeCollections(connection, data.collections);

            if (data.questions && data.questions.length > 0) {
                await initializeQuestions(connection, data.questions, db.name);
            } else {
                console.log(`Pas de questions à initialiser pour ${db.name}`);
            }

            await connection.close();
            console.log(`${db.name} initialisé avec succès`);
        }

        console.log('\nToutes les bases de données ont été initialisées');
        process.exit(0);
    } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
        process.exit(1);
    }
}

initializeDatabase();