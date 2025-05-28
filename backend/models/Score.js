const mongoose = require('mongoose');

const ScoreSchema = new mongoose.Schema({
    score: { type: Number, required: true },
    difficulty: { type: String, required: true },
    database: { type: String },         // Si vous souhaitez sauvegarder la base choisie
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Score', ScoreSchema);