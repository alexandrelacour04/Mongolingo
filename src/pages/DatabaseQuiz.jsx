import React, {useMemo, useState} from 'react';
import QuizGame from '../components/QuizGame';
import DifficultySelector from '../components/DifficultySelector';
import {Box, Typography} from '@mui/material';

/**
 * DatabaseQuiz component that handles the quiz game flow and difficulty selection
 * @component
 * @returns {JSX.Element} The rendered DatabaseQuiz component
 */
const DatabaseQuiz = () => {
    // Track the selected difficulty and database
    const [selection, setSelection] = useState(null);

    // Memoize the window width to avoid re-renders
    const fixedWidth = useMemo(() => window.innerWidth, []);

    /**
     * Handle the difficulty and database selection
     * @param {Object} params - Selection parameters
     * @param {string} params.difficulty - Selected difficulty level
     * @param {string} params.database - Selected database type
     */
    const handleDifficultySelect = ({difficulty, database}) => {
        setSelection({difficulty, database});
    };

    return (
        <Box sx={{width: fixedWidth, maxWidth: '90vw', margin: '0 auto'}}>
            {/* Show difficulty selector if no selection made */}
            {!selection ? (
                <>
                    <Typography variant="h4" gutterBottom align="center" sx={{textAlign: 'center'}}>
                        {selection ? 'Niveau sélectionné' : 'Choisissez votre difficulté'}
                    </Typography>
                    <DifficultySelector onSelect={handleDifficultySelect}/>
                </>
            ) : (
                /* Show quiz game if difficulty is selected */
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