const express = require('express');
const router = express.Router();
const config = require('../config/dbConfig');

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
        // Retourner directement les informations de configuration
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

module.exports = router;