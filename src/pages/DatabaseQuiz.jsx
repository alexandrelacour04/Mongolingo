import React, { useState } from 'react';
import QuizGame from '../components/QuizGame';
import DifficultySelector from '../components/DifficultySelector';
import { Box, Typography } from '@mui/material';

const DatabaseQuiz = () => {
    // On stocke ici la difficulté et la base associée.
    const [selection, setSelection] = useState(null);

    const handleDifficultySelect = ({ difficulty, database }) => {
        setSelection({ difficulty, database });
    };

    return (
        <Box sx={{ p: 4 }}>
            {!selection ? (
                <>
                    <Typography variant="h4" gutterBottom>
                        Choisissez votre difficulté
                    </Typography>
                    <DifficultySelector onSelect={handleDifficultySelect} />
                </>
            ) : (
                <QuizGame
                    initialDifficulty={selection.difficulty}
                    initialDatabase={selection.database}
                    onChangeDifficulty={() => setSelection(null)}
                />
            )}
        </Box>
    );
};

export default DatabaseQuiz;