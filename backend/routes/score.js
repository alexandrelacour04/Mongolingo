const express = require('express');
const router = express.Router();
const Score = require('../models/Score');

/**
 * @swagger
 * /api/scores:
 *   post:
 *     summary: Sauvegarde un nouveau score
 *     tags:
 *       - Score
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - score
 *               - difficulty
 *             properties:
 *               score:
 *                 type: number
 *                 description: Score obtenu
 *               difficulty:
 *                 type: string
 *                 description: Niveau de difficulté (facile, moyen, difficile)
 *               database:
 *                 type: string
 *                 description: Nom de la base (sport, library, events)
 *     responses:
 *       201:
 *         description: Score sauvegardé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 score:
 *                   type: number
 *                 difficulty:
 *                   type: string
 *                 database:
 *                   type: string
 *       400:
 *         description: Score ou difficulté manquants
 *       500:
 *         description: Erreur interne du serveur
 */
router.post('/', async (req, res) => {
    try {
        const {score, difficulty, database} = req.body;
        if (score === undefined || !difficulty) {
            return res.status(400).json({error: 'Score et difficulté sont requis'});
        }
        const newScore = new Score({score, difficulty, database});
        const savedScore = await newScore.save();
        res.status(201).json(savedScore);
    } catch (error) {
        console.error('Erreur lors de la sauvegarde du score :', error);
        res.status(500).json({error: 'Erreur lors de la sauvegarde du score'});
    }
});

module.exports = router;