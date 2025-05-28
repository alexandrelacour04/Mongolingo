import React, {useState} from 'react';
import {TextField, Button, Paper} from '@mui/material';
import axios from "axios";

const QueryArea = ({question, onSuccess, onError}) => {
    const [query, setQuery] = useState('');
    const [feedback, setFeedback] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!query.trim()) {
            setFeedback({
                correct: false,
                message: "Veuillez entrer une requête"
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await axios.post('http://localhost:5000/api/questions/verify', {
                questionId: question._id,
                userQuery: query
            });

            setFeedback({
                correct: response.data.correct,
                message: response.data.correct ?
                    'Correct ! Bien joué !' :
                    `Incorrect. La réponse attendue était : ${response.data.expectedQuery}`
            });

            if (response.data.correct) {
                onSuccess(response.data.points);
            }
        } catch (error) {
            setFeedback({
                correct: false,
                message: "Erreur lors de la vérification de la réponse"
            });
            onError(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <Paper className="p-6" elevation={3}>
                <h3 className="text-lg font-bold mb-2">Question :</h3>
                <p>{question.question}</p>

                {question.hints && question.hints.length > 0 && (
                    <div className="mt-4">
                        <h4 className="font-bold">Indices :</h4>
                        <ul className="list-disc list-inside mt-2">
                            {question.hints.map((hint, index) => (
                                <li key={index}>{hint}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </Paper>

            <Paper className="p-4" elevation={3}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        placeholder="db.collection.find({ ... })"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        disabled={isSubmitting}
                        className="bg-white"
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={!query.trim() || isSubmitting}
                    >
                        {isSubmitting ? 'Vérification en cours...' : 'Vérifier la réponse'}
                    </Button>
                </form>
            </Paper>

            {feedback && (
                <Paper className={`p-4 ${
                    feedback.correct
                        ? 'bg-green-100'
                        : 'bg-red-100'
                }`} elevation={2}>
                    <p className="font-semibold">{feedback.message}</p>
                </Paper>
            )}
        </div>
    );
};

export default QueryArea;