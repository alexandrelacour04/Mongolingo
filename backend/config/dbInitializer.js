const mongoose = require('mongoose');
const {databases} = require('./dbConfig');
const Question = require('../schemas/Question');

const sampleQuestions = {
    library: [],
    automotive: [],
    events: []
};

const initializeDatabase = async (dbConfig) => {
    try {
        const conn = await mongoose.createConnection(dbConfig.uri);

        // Initialiser les questions pour cette base de données
        const questions = sampleQuestions[dbConfig.name] || [];
        const QuestionModel = conn.model('Question', Question.schema);

        // Supprimer les anciennes questions
        await QuestionModel.deleteMany({});

        // Ajouter les nouvelles questions
        if (questions.length > 0) {
            await QuestionModel.insertMany(
                questions.map(q => ({
                    ...q,
                    database: dbConfig.name
                }))
            );
        }

        console.log(`Base de données ${dbConfig.name} initialisée avec succès`);
    } catch (error) {
        console.error(`Erreur lors de l'initialisation de ${dbConfig.name}:`, error);
    }
};

const initializeDatabases = async () => {
    for (const db of databases) {
        await initializeDatabase(db);
    }
};

module.exports = {initializeDatabases};