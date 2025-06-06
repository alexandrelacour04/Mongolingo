const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema(
    {
        pseudo: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        score: {
            type: Number,
            required: true
        },
        difficulty: {
            type: String,
            required: true,
            enum: ["facile", "moyen", "difficile"]
        },
        database: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Score', scoreSchema);