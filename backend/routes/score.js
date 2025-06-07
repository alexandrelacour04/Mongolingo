const express = require('express');
const router = express.Router();
const Score = require('../schemas/Score');

/**
 * Sauvegarde ou met à jour le score utilisateur selon pseudo/mdp/niveau
 * Retourne le top 3 du niveau après sauvegarde
 */
router.post('/', async (req, res) => {
    try {
        const {pseudo, password, score, difficulty, database} = req.body;
        if (!pseudo || !password || score === undefined || !difficulty) {
            return res.status(400).json({error: 'Pseudo, mot de passe, score et difficulté sont requis.'});
        }

        // Rechercher s'il existe déjà ce pseudo pour ce niveau
        const userEntry = await Score.findOne({pseudo, difficulty});

        if (userEntry) {
            if (userEntry.password !== password) {
                return res.status(401).json({error: 'Mot de passe incorrect.'});
            }
            userEntry.score = score;
            userEntry.database = database;
            await userEntry.save();
        } else {
            // Création d'une nouvelle entrée utilisateur/niveau
            const newScore = new Score({pseudo, password, score, difficulty, database});
            await newScore.save();
        }

        // Récupère le top 3 des scores pour ce niveau
        const top3 = await Score.find({difficulty})
            .sort({score: -1, updatedAt: 1})
            .limit(3)
            .select('pseudo score -_id');

        res.status(201).json({success: true, top3});
    } catch (error) {
        console.error('Erreur lors de la sauvegarde du score :', error);
        res.status(500).json({error: 'Erreur lors de la sauvegarde.'});
    }
});

/**
 * Récupération du top 3 d’un niveau de difficulté
 */
router.get('/top/:difficulty', async (req, res) => {
    try {
        const {difficulty} = req.params;
        const top3 = await Score.find({difficulty})
            .sort({score: -1, updatedAt: 1})
            .limit(3)
            .select('pseudo score -_id');
        res.json(top3);
    } catch (error) {
        res.status(500).json({error: 'Erreur récupération top scores.'});
    }
});

module.exports = router;