import React, {useMemo, useState} from 'react';
import QuizGame from '../components/QuizGame';
import DifficultySelector from '../components/DifficultySelector';
import {Box, Button, Menu, MenuItem, Typography} from '@mui/material';
import axios from 'axios';

/**
 * DatabaseQuiz component that handles the quiz game flow and difficulty selection
 * @component
 * @returns {JSX.Element} The rendered DatabaseQuiz component
 */
const DatabaseQuiz = () => {
    // Track the selected difficulty and database
    const [selection, setSelection] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);

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

    const handleExportClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleExportClose = () => {
        setAnchorEl(null);
    };

    const handleExport = async (format) => {
        try {
            const response = await axios.get(`/api/database/export/${selection?.database}/${format}`, {
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${selection?.database}_export.${format}`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error('Erreur lors de l\'export:', error);
        }
        handleExportClose();
    };

    return (
        <Box sx={{width: fixedWidth, maxWidth: '90vw', margin: '0 auto', position: 'relative'}}>
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

            {selection && (
                <>
                    <Button
                        variant="contained"
                        onClick={handleExportClick}
                        sx={{
                            position: 'fixed',
                            bottom: '20px',
                            right: '20px',
                            backgroundColor: '#10B981',
                            '&:hover': {
                                backgroundColor: '#059669'
                            }
                        }}
                    >
                        Exporter la base de données
                    </Button>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleExportClose}
                    >
                        <MenuItem onClick={() => handleExport('json')}>
                            Export en JSON
                        </MenuItem>
                        <MenuItem onClick={() => handleExport('bson')}>
                            Export en BSON
                        </MenuItem>
                    </Menu>
                </>
            )}
        </Box>
    );
};

export default DatabaseQuiz;