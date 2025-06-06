const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const dbConfig = require('../config/dbConfig'); // Assurez-vous que le chemin est correct

router.get('/', async (req, res) => {
    try {
        const schemas = {};
        if (!dbConfig || !dbConfig.databases) {
            console.error("[schemaRoute] dbConfig ou dbConfig.databases n'est pas défini.");
            return res.status(500).json({ error: "Configuration de la base de données manquante ou incorrecte côté serveur." });
        }

        console.log(`[schemaRoute] Traitement de ${dbConfig.databases.length} base(s) de données.`);

        for (const db of dbConfig.databases) {
            console.log(`[schemaRoute] Tentative de connexion à la base de données : ${db.name} via URI: ${db.uri}`);
            if (!db.uri) {
                console.warn(`[schemaRoute] URI manquante pour la base de données : ${db.name}`);
                schemas[db.name] = { error: "URI de connexion manquante." };
                continue;
            }

            let conn;
            try {
                // mongoose.createConnection retourne une promesse qui se résout avec l'objet Connection.
                // .asPromise() est utilisé pour la clarté et la compatibilité, Mongoose 6+ le fait implicitement.
                conn = await mongoose.createConnection(db.uri, dbConfig.mongodb.options).asPromise();

                // readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting, 99 = uninitialized
                if (conn.readyState !== 1) { // 1 signifie 'connected'
                    console.error(`[schemaRoute] Échec de la connexion à la base de données ${db.name}. readyState: ${conn.readyState}`);
                    schemas[db.name] = { error: `Impossible de se connecter à la base de données ${db.name}. État: ${conn.readyState}` };
                    // Tenter de fermer la connexion si elle n'est pas nulle et a une méthode close
                    if (conn && typeof conn.close === 'function') {
                        await conn.close();
                    }
                    continue;
                }

                console.log(`[schemaRoute] Connecté avec succès à ${db.name}. Récupération des collections...`);

                if (!conn.db) {
                    console.error(`[schemaRoute] conn.db est indéfini pour ${db.name} malgré un readyState de ${conn.readyState}. C'est inattendu.`);
                    schemas[db.name] = { error: `Problème interne lors de la récupération de l'objet db pour ${db.name}.` };
                    await conn.close();
                    continue;
                }

                const collectionsData = await conn.db.listCollections().toArray();
                console.log(`[schemaRoute] ${collectionsData.length} collection(s) trouvée(s) pour ${db.name}.`);
                schemas[db.name] = {};

                for (const collection of collectionsData) {
                    console.log(`[schemaRoute] Traitement de la collection : ${collection.name} dans ${db.name}`);
                    const sampleDoc = await conn.db.collection(collection.name).findOne();
                    if (sampleDoc) {
                        schemas[db.name][collection.name] = {
                            fields: Object.keys(sampleDoc).reduce((acc, key) => {
                                acc[key] = typeof sampleDoc[key];
                                return acc;
                            }, {})
                        };
                    } else {
                        schemas[db.name][collection.name] = { fields: {}, note: "Collection vide ou aucun document trouvé pour l'échantillon." };
                    }
                }
            } catch (connectionError) {
                console.error(`[schemaRoute] Erreur de connexion ou d'interrogation pour la base de données ${db.name}:`, connectionError.message);
                // console.error(connectionError.stack); // Décommentez pour une trace complète
                schemas[db.name] = { error: `Impossible de se connecter ou d'interroger la base de données ${db.name}.`, details: connectionError.message };
            } finally {
                if (conn && typeof conn.close === 'function' && conn.readyState === 1) {
                    console.log(`[schemaRoute] Fermeture de la connexion à ${db.name}.`);
                    await conn.close();
                } else if (conn && typeof conn.close === 'function') {
                    console.log(`[schemaRoute] Connexion à ${db.name} n'était pas dans un état 'connected' (readyState: ${conn.readyState}), tentative de fermeture.`);
                    try {
                        await conn.close();
                    } catch (closeError) {
                        console.error(`[schemaRoute] Erreur lors de la tentative de fermeture d'une connexion (état: ${conn.readyState}) à ${db.name}:`, closeError.message);
                    }
                }
            }
        }

        // console.log("[schemaRoute] Schémas compilés :", JSON.stringify(schemas, null, 2)); // Peut être très verbeux
        res.json(schemas);
    } catch (err) {
        console.error("[schemaRoute] Erreur globale dans /api/schema :", err.message);
        // console.error(err.stack); // Décommentez pour une trace complète
        res.status(500).json({ error: "Erreur serveur globale sur /api/schema", details: err.message });
    }
});

module.exports = router;
