const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    difficulty: {
        type: String,
        required: true,
        enum: ['facile', 'moyen', 'difficile']
    },
    question: {
        type: String,
        required: true
    },
    expectedQuery: {
        type: String,
        required: true
    },
    hints: {
        type: [String],
        default: []
    },
    points: {
        type: Number,
        required: true
    },
    database: {
        type: String,
        required: true
    }
});

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;