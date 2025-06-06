// backend/schemas/databaseSchemas.js
const questionSchema = {
    type: 'object',
    required: ['difficulty', 'question', 'expectedQuery'],
    properties: {
        difficulty: { type: 'string', enum: ['facile', 'moyen', 'difficile'] },
        question: { type: 'string' },
        expectedQuery: { type: 'string' },
        hints: {
            type: 'array',
            items: { type: 'string' }
        },
        points: { type: 'number' }
    }
};

const databaseSchema = {
    type: 'object',
    required: ['name', 'questions', 'collections'],
    properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        collections: { type: 'object' },
        questions: {
            type: 'array',
            items: questionSchema
        }
    }
};

const validateDatabaseSchema = (data) => {
    // Vérification basique de la structure
    if (!data || typeof data !== 'object') {
        return false;
    }

    // Vérification du nom de la base et des collections
    if (!data.name || typeof data.name !== 'string' || !data.collections || typeof data.collections !== 'object') {
        return false;
    }

    // Vérification des questions
    if (!Array.isArray(data.questions)) {
        return false;
    }

    // Vérification de chaque question
    return data.questions.every(question => {
        return (
            question.difficulty &&
            ['facile', 'moyen', 'difficile'].includes(question.difficulty) &&
            question.question &&
            typeof question.question === 'string' &&
            question.expectedQuery &&
            typeof question.expectedQuery === 'string' &&
            (!question.hints || Array.isArray(question.hints)) &&
            (!question.points || typeof question.points === 'number')
        );
    });
};

module.exports = {
    validateDatabaseSchema,
    databaseSchema,
    questionSchema
};