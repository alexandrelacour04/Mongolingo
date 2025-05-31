import React, {useState, useMemo} from 'react';
import QuizGame from '../components/QuizGame';
import DifficultySelector from '../components/DifficultySelector';
import {Box, Typography} from '@mui/material';

const DatabaseQuiz = () => {
    const [selection, setSelection] = useState(null);
    const fixedWidth = useMemo(() => window.innerWidth, []);

    const handleDifficultySelect = ({difficulty, database}) => {
        setSelection({difficulty, database});
    };

    return (
        <Box sx={{width: fixedWidth, maxWidth: '90vw', margin: '0 auto'}}>
            {!selection ? (
                <>
                    <Typography variant="h4" gutterBottom align="center" sx={{textAlign: 'center'}}>
                        {selection ? 'Niveau sélectionné' : 'Choisissez votre difficulté'}
                    </Typography>
                    <DifficultySelector onSelect={handleDifficultySelect}/>
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