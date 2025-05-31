const express = require('express');
const fs = require('fs');
const path = require('path');
const config = require('../config/dbConfig');
const router = express.Router();
const mongoose = require('mongoose');

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

module.exports = router;