# Mongolingo 🎮

Mongolingo est une application web interactive pour apprendre et pratiquer les requêtes MongoDB de manière ludique.
L'application propose un quiz avec différents niveaux de difficulté et une interface drag-and-drop pour construire des
requêtes.

## Table des matières 📑

1. [Prérequis](#prérequis)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Utilisation](#utilisation)
5. [Structure du projet](#structure-du-projet)
6. [Fonctionnalités](#fonctionnalités)
7. [Base de données](#base-de-données)
8. [API](#api)
9. [Contribution](#contribution)
10. [Dépannage](#dépannage)

## Vidéo de présentation 🎥

[Vidéo de présentation](docs/Mongolingo-LACOUR-Alexandre.mp4)

## Prérequis 📋

- Node.js (v18 ou supérieur)
- MongoDB (v6.0 ou supérieur)
- npm (dernière version stable)

## Installation 🚀

1. Cloner le dépôt :

```bash 
git clone [https://github.com/votre-repo/mongolingo.git](https://github.com/votre-repo/mongolingo.git) cd mongolingo
``` 

2. Installer les dépendances du frontend :

```bash 
npm install
``` 

3. Installer les dépendances du backend :

```bash 
cd backend 
npm install
``` 

4. Configurer les variables d'environnement :

```bash 
cp .env.example .env # Modifier les variables dans .env selon votre configuration
``` 

## Configuration ⚙️

### MongoDB

1. S'assurer que MongoDB est en cours d'exécution sur votre machine
2. Créer une base de données MongoDB :

```bash 
mongod --dbpath=/chemin/vers/data
``` 

### Backend

1. Configurer le fichier `backend/config/dbConfig.js` avec vos paramètres MongoDB
2. Configuration du port (par défaut : 5000) dans `backend/server.js`

### Frontend

1. Configuration du proxy dans `vite.config.js` (pointe vers le backend)
2. Variables d'environnement dans `.env`

## Utilisation 🎮

1. Démarrer le serveur backend :

```bash 
cd backend 
npm start
``` 

2. Démarrer l'application frontend dans un nouveau terminal :

```bash 
npm run dev
``` 

3. Accéder à l'application : `http://localhost:5173`

## Structure du projet 📁

```
mongolingo/ 
├── backend/ 
│ ├── config/ # Configuration MongoDB et autres 
│ ├── data/ # Données des quiz 
│ ├── routes/ # Routes API 
│ ├── schemas/ # Schémas Mongoose 
│ └── server.js # Point d'entrée du serveur 
├── src/ 
│ ├── components/ # Composants React 
│ ├── pages/ # Pages de l'application 
│ ├── assets/ # Ressources statiques 
│ └── App.jsx # Composant racine 
└── public/ # Fichiers statiques
``` 

## Fonctionnalités 🌟

### Quiz MongoDB

- 3 niveaux de difficulté (Facile, Moyen, Difficile)
- Construction de requêtes par drag-and-drop
- Système de vies (3 vies par partie)
- Indices progressifs
- Validation en temps réel des requêtes

### Base de données personnalisée

- Import/Export de bases de données (JSON/BSON)
- Visualisation des schémas
- Exécution des requêtes en temps réel

### Système de score

- Tableau des meilleurs scores
- Sauvegarde des scores par niveau
- Classement par difficulté

## Base de données 💾

### Bases de données préconfiguées

1. `automotive` (Niveau Facile)
2. `events` (Niveau Moyen)
3. `library` (Niveau Difficile)

### Import de données

Format JSON requis :

```json 
{
  "name": "nom_base",
  "collections": {
    "collection1": [
      ...
    ],
    "collection2": [
      ...
    ]
  },
  "questions": [
    ...
  ]
}
``` 

## API 📡

### Points d'entrée principaux

- `POST /api/database/import` : Import de base de données
- `GET /api/questions` : Récupération des questions
- `POST /api/database/execute` : Exécution de requête
- `GET /api/scores` : Récupération des scores

## Dépannage 🔧

### Problèmes courants

1. Erreur BSON

```
Solution : Mettre à jour les dépendances : npm install bson@6.2.0 mongodb@6.3.0 mongoose@8.0.3
``` 

2. Erreur de connexion MongoDB

```
Vérifier :
- Le service MongoDB est en cours d'exécution
- Les informations de connexion dans dbConfig.js
- Le port MongoDB (27017 par défaut)
``` 

3. Problèmes d'import de base de données

```
- Vérifier le format JSON/BSON
- Vérifier les droits d'accès au dossier uploads/
- Vérifier la taille du fichier (<16MB)
``` 

## Contribution 🤝

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'Add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## Licence 📄

Ce projet est sous licence MIT. Voir le fichier `LICENSE`

