const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const databaseRouter = require('./routes/database');
const questionsRouter = require('./routes/questions');
const scoresRouter = require('./routes/score');
const databaseRoutes = require('./routes/database');
const schemaRoute = require('./routes/schemaRoute');

const app = express();

// Middleware pour parser le JSON et les CORS
app.use(express.json());
app.use(cors());

// Headers pour assurer que les réponses sont en JSON
app.use((req, res, next) => {
    res.header('Content-Type', 'application/json');
    next();
});

// Routes API
app.use('/api/database', databaseRouter);
app.use('/api/questions', questionsRouter);
app.use('/api/scores', scoresRouter);
app.use('/api/database', databaseRoutes);
app.use('/api', databaseRoutes);
app.use('/api/schema', schemaRoute);

// Servir les fichiers statiques en production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../dist')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../dist/index.html'));
    });
}

// Middleware de gestion d'erreurs
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Une erreur est survenue',
        message: err.message
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});

module.exports = app;