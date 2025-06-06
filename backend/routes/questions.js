const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {MongoClient} = require('mongodb');
const Question = require('../schemas/Question');
const config = require('../config/dbConfig');

router.get('/', async (req, res) => {
    const {database, difficulty} = req.query;
    const client = new MongoClient('mongodb://localhost:27017');

    try {
        if (!database) {
            return res.status(400).json({
                success: false,
                error: 'Le paramètre database est requis',
                availableDatabases: config.databases.map(db => db.name)
            });
        }

        const dbConfig = config.databases.find(db => db.name === database);
        if (!dbConfig) {
            return res.status(404).json({
                success: false,
                error: `Base de données "${database}" non trouvée`,
                availableDatabases: config.databases.map(db => db.name)
            });
        }

        await client.connect();
        const db = client.db(`${database}_db`);

        const filter = {database};
        if (difficulty) {
            filter.difficulty = difficulty;
        }

        const questions = await db.collection('questions')
            .find(filter)
            .toArray();

        if (!questions || questions.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Aucune question trouvée pour cette base de données et cette difficulté'
            });
        }

        const questionArray = questions.map(q => ({
            id: q._id,
            question: q.question,
            expectedQuery: q.expectedQuery,
            hints: q.hints || [],
            points: q.points || 1,
            difficulty: q.difficulty,
            database: q.database,
            collection: q.collection,
            operation: q.operation
        }));

        res.json(questionArray);

    } catch (error) {
        console.error('Erreur dans la route GET /api/questions :', error);
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la récupération des questions',
            message: error.message,
            availableDatabases: config.databases.map(db => db.name)
        });
    } finally {
        await client.close();
    }
});

module.exports = router;