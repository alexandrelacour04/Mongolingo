# Mongolingo
Mongolingo est une application web interactive qui permet d’apprendre et de pratiquer l’écriture de requêtes MongoDB à travers des quiz ludiques et progressifs.
Elle se compose d’un **backend Node.js/Express** et d’un **frontend React**. La communication entre les deux se fait via une API REST sécurisée.
## Table des matières
1. [Fonctionnalités](#fonctionnalit%C3%A9s)
2. [Architecture du projet](#architecture-du-projet)
3. [Backend - Node.js/Express](#backend---nodejsexpress)
    - [Installation et lancement](#installation-et-lancement-backend)
    - [Structure des routes](#structure-des-routes)
    - [Gestion des questions et bases de données](#gestion-des-questions-et-bases-de-donn%C3%A9es)

4. [Frontend - React](#frontend---react)
    - [Installation et lancement](#installation-et-lancement-frontend)
    - [Principaux composants](#principaux-composants)

5. [Configuration](#configuration)
6. [Développement et scripts utiles](#d%C3%A9veloppement-et-scripts-utiles)
7. [Crédits & Licence](#cr%C3%A9dits--licence)

## Fonctionnalités
- Quiz sur les requêtes MongoDB avec correction intelligente.
- Gestion des vies et du score.
- Indices interactifs pour chaque question.
- Système de drag & drop ou double-clic pour construire la requête.
- Multi-difficulté et choix de thèmes de base de données.
- Frontend ergonomique et responsif (Material UI, React).
- Backend Node.js servie via Express, accès REST aux questions, scores, etc.
- Gestion et enrichissement des questions via des fichiers JSON.

## Architecture du projet
``` 
mongolingo/
│
├── backend/
│   ├── config/           # (Fichiers de configuration serveur ou BDD)
│   ├── data/             # Fichiers de données/questions pour les quiz (ex: automotive.js, events.js)
│   ├── models/           # Modèles de données s’il y en a (Mongoose ou autres)
│   ├── routes/           # Routes Express (API REST)
│   ├── scripts/          # (Scripts utilitaires divers)
│   ├── server.js         # Point d’entrée du serveur Express
│   ├── package.json      # Dépendances et scripts backend
│   └── package-lock.json
│
├── json/                 # Base de questions au format .json (ex : automotive_db.questions.json)
│
├── public/               # Fichiers statiques publics
│
├── src/                  # Frontend React
│   ├── assets/           # Images et ressources statiques du front
│   ├── components/       # Composants d’interface (Quiz, Drag & Drop, Vie, etc.)
│   ├── pages/            # Pages principales du front (Quiz, Accueil, etc.)
│   ├── App.jsx, main.jsx, index.css, ... # Fichiers de base React
│   ├── package.json      # Dépendances, scripts frontend
│   └── package-lock.json
│
├── .gitignore
├── README.md
├── tailwind.config.js
├── vite.config.js
└── TODO, autres fichiers de config
```
## Backend - Node.js/Express
Le backend fournit une API REST pour servir les questions de quiz, enregistrer les scores, etc.
### Installation et lancement (backend)
Depuis le dossier `backend/` :
``` bash
cd backend
npm install
npm start
```
Par défaut, le backend écoute sur le port 3001 (modifiable dans ). `server.js`
### Structure des routes
Dans `backend/routes/` :
- `questions.js` :
    - `GET /api/questions` — Récupère les questions selon le thème et la difficulté.


- `database.js` :
    - `GET /api/databases` — Liste les bases de données/thèmes disponibles.


- `score.js` :
    - `POST /api/score` — Enregistre un nouveau score.
    - `GET /api/scores` — Récupère les meilleurs scores.



Le backend gère la validation, recherche des questions, la persistance des scores (MongoDB via Mongoose).
### Gestion des questions et bases de données
- Les questions sont organisées par thèmes (ex : automotive, events…).
- Format des questions : fichiers `.js` dans `backend/data/` ou `.json` dans `json/`. 
- Chaque question peut inclure plusieurs indices et sa requête attendue.

## Frontend - React
Interface utilisateur en React, stylée avec Material UI, pour une expérience moderne et responsive.
### Installation et lancement (frontend)
Depuis le dossier principal ou  : `src/`
``` bash
npm install
npm run dev
```
ou
``` bash
cd src
npm install
npm run dev
```
Le frontend s’exécute typiquement sur le port 5173 (Vite.js).
### Principaux composants
- `App.jsx`: Point d’entrée de l’app. 
- `pages/`: Navigation vers le quiz, l’accueil, etc. 
- `components/`
    - `QuizGame.jsx`: Logique principale du quiz. 
    - `DraggableQueryBuilder.jsx`: Construction des requêtes par drag & drop et double-clic. 
    - `LifeCounter.jsx`: Affichage du compteur de vies. 
    - `DifficultySelector.jsx`: Sélection de la difficulté. 
    - (autres pour la navigation et le style)



Supporte :
- Sélection du thème (base de données)
- Choix de difficulté
- Progression sauvegardée dans la session
- Correction instantanée, gestion des vies, indices, feedback, etc.

## Configuration
- `.env` à la racine du backend pour les variables d’environnement (ex : connexion MongoDB si besoin).
- Ports personnalisables via les scripts de lancement.
- Les questions sont facilement éditables/ajoutables sous `backend/data/`.

## Développement et scripts utiles
- Lancer backend :
``` bash
  cd backend
  npm start          # ou npm run dev pour hot-reload
```
- Lancer frontend :
``` bash
  npm run dev        # depuis la racine ou le dossier src/
```
- Linter, formatage, tests : voir les scripts dans chaque `package.json`. 

## Crédits & Licence
Développé par **Alexandre LACOUR, IUT de Vannes 2025**
<br>
Merci d’utiliser Mongolingo pour l’apprentissage de la syntaxe MongoDB! <br>
Pour toute suggestion ou contribution, n’hésitez pas à ouvrir une issue ou une pull request. <br> <br> 
**Bon apprentissage MongoDB 🚀 !**
