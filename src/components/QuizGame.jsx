import React, {useState, useEffect} from 'react';
import {
    Box,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Paper
} from '@mui/material';
import DraggableQueryBuilder from './DraggableQueryBuilder';
import LifeCounter from './LifeCounter';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import ShowTablesPopup from './ShowTablesPopup';

const QuizGame = ({initialDatabase, initialDifficulty, onChangeDifficulty}) => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [lives, setLives] = useState(3);
    const [gameOver, setGameOver] = useState(false);
    const [showGameOverDialog, setShowGameOverDialog] = useState(false);
    const [currentHintIndex, setCurrentHintIndex] = useState(-1);
    const [showHints, setShowHints] = useState(false);
    const [showJson, setShowJson] = useState(false);

    useEffect(() => {
        fetchQuestions();
    }, [initialDatabase, initialDifficulty]);

    const fetchQuestions = async () => {
        try {
            const response = await fetch(
                `/api/questions?database=${initialDatabase}&difficulty=${initialDifficulty}`
            );
            if (!response.ok) throw new Error('Erreur lors du chargement des questions');
            const data = await response.json();
            setQuestions(data);
            resetGame();
        } catch (err) {
            console.error("Erreur:", err);
        }
    };

    const resetGame = () => {
        setCurrentQuestionIndex(0);
        setLives(3);
        setGameOver(false);
        setCurrentHintIndex(-1);
        setShowHints(false);
    };

    const handleNextHint = () => {
        if (!questions[currentQuestionIndex]?.hints) return;
        if (currentHintIndex < questions[currentQuestionIndex].hints.length - 1) {
            setCurrentHintIndex(prev => prev + 1);
        }
    };

    const handleAnswerSubmit = (userAnswer) => {
        const currentQuestion = questions[currentQuestionIndex];
        const isCorrect = userAnswer.trim() === currentQuestion.expectedQuery.trim();

        if (!isCorrect) {
            const newLives = lives - 1;
            setLives(newLives);

            if (newLives === 0) {
                setGameOver(true);
                setShowGameOverDialog(true);
                return;
            }
        }

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setCurrentHintIndex(-1);
            setShowHints(false);
        } else {
            setGameOver(true);
            setShowGameOverDialog(true);
        }
    };

    const currentQuestion = questions[currentQuestionIndex];

    if (!currentQuestion) return null;

    return (
        <Box sx={{width: '100%'}}>
            {!gameOver && (
                <Box>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mb: 3,
                        alignItems: 'center'
                    }}>
                        <Typography variant="h6">
                            Question {currentQuestionIndex + 1} / {questions.length}
                        </Typography>
                        <Box sx={{display: 'flex', justifyContent: 'flex-end', mb: 3, mr: 3, mt: 1.5, width: '100px'}}>
                            <LifeCounter lives={lives}/>
                        </Box>
                    </Box>

                    <Paper elevation={3} sx={{p: 3, mb: 3}}>
                        <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2}}>
                            <Typography variant="h6">{currentQuestion.question}</Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<LightbulbIcon/>}
                                onClick={() => {
                                    setShowHints(true);
                                    if (currentHintIndex === -1) handleNextHint();
                                }}
                            >
                                Indices
                            </Button>
                        </Box>

                        {showHints && currentQuestion.hints && (
                            <Paper sx={{p: 2, mb: 2, bgcolor: 'background.default'}}>
                                <Typography variant="h6" color="primary" gutterBottom>
                                    Indices disponibles :
                                </Typography>
                                {currentQuestion.hints.slice(0, currentHintIndex + 1).map((hint, index) => (
                                    <Typography key={index} variant="body1" sx={{mb: 1}}>
                                        {index + 1}. {hint}
                                    </Typography>
                                ))}
                                {currentHintIndex < currentQuestion.hints.length - 1 && (
                                    <Button
                                        onClick={handleNextHint}
                                        variant="outlined"
                                        color="primary"
                                        sx={{mt: 1}}
                                    >
                                        Indice suivant
                                    </Button>
                                )}
                            </Paper>
                        )}

                        <ShowTablesPopup dbName={`${initialDatabase}_db`}/>

                        <DraggableQueryBuilder
                            expectedQuery={currentQuestion.expectedQuery}
                            onSubmit={handleAnswerSubmit}
                        />
                    </Paper>
                </Box>
            )}

            <Dialog
                open={showGameOverDialog}
                onClose={() => {
                    setShowGameOverDialog(false);
                    onChangeDifficulty();
                }}
            >
                <DialogTitle>
                    {lives === 0 ? 'Game Over' : 'Quiz Terminé !'}
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        {lives === 0
                            ? 'Vous avez épuisé toutes vos vies !'
                            : `Félicitations ! Vous avez terminé le quiz avec ${lives} vies restantes.`}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            setShowGameOverDialog(false);
                            onChangeDifficulty();
                        }}
                        color="primary"
                        variant="contained"
                    >
                        Retour au menu
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default QuizGame;