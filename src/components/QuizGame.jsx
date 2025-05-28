import React, {useState, useEffect} from 'react';
import {Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, Tooltip} from '@mui/material';
import DraggableQueryBuilder from './DraggableQueryBuilder';
import LifeCounter from './LifeCounter';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import axios from 'axios';

const QuizGame = ({initialDatabase, initialDifficulty, onChangeDifficulty}) => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [lives, setLives] = useState(3);
    const [failedQuestions, setFailedQuestions] = useState([]);
    const [gameOver, setGameOver] = useState(false);
    const [showGameOverDialog, setShowGameOverDialog] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [questionCount, setQuestionCount] = useState(0);
    const [retryMode, setRetryMode] = useState(false);
    const [currentHintIndex, setCurrentHintIndex] = useState(0);
    const [showHints, setShowHints] = useState(false);

    useEffect(() => {
        fetchQuestions();
    }, [initialDatabase, initialDifficulty]);

    useEffect(() => {
        resetHints();
    }, [currentQuestionIndex]);

    const fetchQuestions = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(
                `/api/questions?database=${encodeURIComponent(initialDatabase)}&difficulty=${encodeURIComponent(initialDifficulty)}`
            );

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("La réponse du serveur n'est pas au format JSON");
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Erreur ${response.status}`);
            }

            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                setQuestions(data);
                setQuestionCount(data.length);
                setCurrentQuestionIndex(0);
                setLives(3);
                setFailedQuestions([]);
                setGameOver(false);
                setRetryMode(false);
            } else {
                throw new Error('Aucune question disponible');
            }
        } catch (err) {
            console.error("Erreur lors du chargement des questions:", err);
            setError(err.message || "Une erreur est survenue");
        } finally {
            setLoading(false);
        }
    };

    const getCurrentQuestion = () => {
        if (retryMode) {
            return failedQuestions[currentQuestionIndex];
        }
        return questions[currentQuestionIndex];
    };

    const handleNextHint = () => {
        setCurrentHintIndex(prev => prev + 1);
    };

    const resetHints = () => {
        setCurrentHintIndex(0);
        setShowHints(false);
    };

    const handleAnswerSubmit = (answer) => {
        if (!questions[currentQuestionIndex]) return;

        const currentQuestion = questions[currentQuestionIndex];
        const isCorrect = answer.trim().toLowerCase() === currentQuestion.expectedQuery.toLowerCase();

        if (!isCorrect) {
            const newLives = lives - 1;
            setLives(newLives);

            const failedQuestion = {
                ...currentQuestion,
                userAnswer: answer
            };
            setFailedQuestions(prev => [...prev, failedQuestion]);

            if (newLives === 0) {
                setGameOver(true);
                setShowGameOverDialog(true);
                return;
            }
        }

        handleNextQuestion();
    };

    const handleNextQuestion = () => {
        if (retryMode) {
            const newFailedQuestions = failedQuestions.filter((_, index) => index !== currentQuestionIndex);
            setFailedQuestions(newFailedQuestions);

            if (newFailedQuestions.length === 0) {
                setGameOver(true);
                setShowGameOverDialog(true);
            } else {
                setCurrentQuestionIndex(0);
            }
        } else {
            const nextIndex = currentQuestionIndex + 1;
            if (nextIndex >= questions.length) {
                if (failedQuestions.length > 0) {
                    setRetryMode(true);
                    setCurrentQuestionIndex(0);
                } else {
                    setGameOver(true);
                    setShowGameOverDialog(true);
                }
            } else {
                setCurrentQuestionIndex(nextIndex);
            }
        }
    };

    if (loading) {
        return (
            <Box sx={{width: '100%', p: 3}}>
                <Box className="quiz-container">
                    <Typography variant="h5" align="center">Chargement...</Typography>
                </Box>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{width: '100%', p: 3}}>
                <Box className="quiz-container">
                    <Typography variant="h5" color="error" align="center">{error}</Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={fetchQuestions}
                        fullWidth
                        sx={{mt: 2}}
                    >
                        Réessayer
                    </Button>
                </Box>
            </Box>
        );
    }

    const currentQuestion = retryMode ? failedQuestions[currentQuestionIndex] : questions[currentQuestionIndex];

    return (
        <Box sx={{width: '100%', p: 3}}>
            {!gameOver && (
                <>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        mb: 2
                    }}>
                        <Typography variant="h6" sx={{color: 'white'}}>
                            {retryMode ? 'Questions à revoir' : 'Question'} {currentQuestionIndex + 1} /
                            {retryMode ? failedQuestions.length : questions.length}
                        </Typography>
                        <LifeCounter lives={lives}/>
                    </Box>

                    <Box className="quiz-container">
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            mb: 2
                        }}>
                            <Typography variant="body1">
                                {getCurrentQuestion()?.question}
                            </Typography>

                            <Tooltip title="Voir les indices">
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    size="small"
                                    startIcon={<LightbulbIcon/>}
                                    onClick={() => setShowHints(true)}
                                    sx={{minWidth: 'auto'}}
                                >
                                    Indices
                                </Button>
                            </Tooltip>
                        </Box>

                        {showHints && getCurrentQuestion()?.hints?.length > 0 && (
                            <Box sx={{
                                mb: 2,
                                p: 2,
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                borderRadius: 1,
                                border: '1px solid rgba(255, 255, 255, 0.2)'
                            }}>
                                <Typography variant="h6" sx={{color: 'secondary.main', mb: 1}}>
                                    Indices disponibles :
                                </Typography>
                                {getCurrentQuestion().hints.slice(0, currentHintIndex + 1).map((hint, index) => (
                                    <Typography
                                        key={index}
                                        variant="body2"
                                        sx={{
                                            color: 'white',
                                            mb: 1,
                                            '&:last-child': {mb: 0}
                                        }}
                                    >
                                        {index + 1}. {hint}
                                    </Typography>
                                ))}

                                {currentHintIndex < getCurrentQuestion().hints.length - 1 && (
                                    <Button
                                        variant="text"
                                        color="secondary"
                                        size="small"
                                        onClick={handleNextHint}
                                        sx={{mt: 1}}
                                    >
                                        Révéler l'indice suivant
                                    </Button>
                                )}
                            </Box>
                        )}

                        <Box mb={4}>
                            <DraggableQueryBuilder
                                expectedQuery={currentQuestion.expectedQuery}
                                onSubmit={handleAnswerSubmit}
                            />
                        </Box>
                    </Box>
                </>
            )}

            <Dialog
                open={showGameOverDialog}
                onClose={() => setShowGameOverDialog(false)}
                aria-labelledby="game-over-dialog-title"
            >
                <DialogTitle id="game-over-dialog-title">
                    {lives === 0 ? 'Game Over' : 'Quiz Terminé !'}
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        {lives === 0
                            ? 'Vous avez épuisé toutes vos vies !'
                            : 'Félicitations ! Vous avez terminé le quiz.'}
                    </Typography>
                    {lives > 0 && (
                        <Typography variant="body2" sx={{mt: 2}}>
                            Questions réussies : {questions.length - failedQuestions.length} / {questions.length}
                        </Typography>
                    )}
                    {lives > 0 && (
                        <Typography variant="body2">
                            Vies restantes : {lives}
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setShowGameOverDialog(false);
                        onChangeDifficulty && onChangeDifficulty();
                    }} color="primary" variant="contained">
                        Terminer
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default QuizGame;