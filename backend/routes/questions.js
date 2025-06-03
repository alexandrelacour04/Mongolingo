const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Question = require('../schemas/Question');
const config = require('../config/dbConfig');

router.get('/', async (req, res) => {
    try {
        const { database, difficulty } = req.query;
        console.log('Paramètres reçus:', { database, difficulty });

        if (!database) {
            return res.status(400).json({
                error: 'Le paramètre database est requis',
                availableDatabases: config.databases.map(db => db.name)
            });
        }

        const dbConfig = config.databases.find(db => db.name === database);
        if (!dbConfig) {
            return res.status(404).json({
                error: `Base de données "${database}" non trouvée`,
                availableDatabases: config.databases.map(db => db.name)
            });
        }

        const connection = await mongoose.createConnection(dbConfig.uri);
        const QuestionModel = connection.model('Question', Question.schema);

        const filter = { database };
        if (difficulty) {
            filter.difficulty = difficulty;
        }

        const questions = await QuestionModel.find(filter);
        await connection.close();

        // Assurez-vous que la réponse est bien un tableau
        const questionArray = questions.map(q => ({
            id: q._id,
            question: q.question,
            expectedQuery: q.expectedQuery,
            hints: q.hints || [],
            points: q.points || 1,
            difficulty: q.difficulty,
            database: q.database
        }));

        res.json(questionArray);

    } catch (error) {
        console.error('Erreur dans la route GET /api/questions :', error);
        res.status(500).json({
            error: 'Erreur lors de la récupération des questions',
            message: error.message,
            availableDatabases: config.databases.map(db => db.name)
        });
    }
});

module.exports = router;