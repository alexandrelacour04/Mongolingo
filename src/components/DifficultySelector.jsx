import React from "react";
import {Box, Button} from "@mui/material";
import DatabaseImport from './DatabaseImport';

/**
 * Component for selecting difficulty level in the quiz application
 * @param {Object} props Component properties
 * @param {Function} props.onSelect Callback function triggered when a difficulty is selected
 * @returns {JSX.Element} Rendered difficulty selector component
 */
const DifficultySelector = ({onSelect}) => {

    /**
     * Array defining the different difficulty levels and their associated databases
     * @type {Array<{label: string, value: string, database: string}>}
     */
    const difficulties = [
        {label: "Facile", value: "facile", database: "automotive"},
        {label: "Moyen", value: "moyen", database: "events"},
        {label: "Difficile", value: "difficile", database: "library"}
    ];

    /**
     * Handles successful database import
     * @param {string} database The imported database name
     */
    const handleImportSuccess = (database) => {
        onSelect({
            difficulty: "facile",
            database: database
        });
    };

    /**
     * Handles the selection of a difficulty level
     * @param {string} difficulty The selected difficulty value
     */
    const handleSelect = (difficulty) => {
        const selected = difficulties.find(d => d.value === difficulty);
        if (onSelect && selected) {
            onSelect({difficulty: selected.value, database: selected.database});
        }
    };

    return (
        <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
            <Box sx={{
                display: "flex",
                gap: 2,
                justifyContent: "center",
                mt: 2,
                mb: 2,
            }}>
                {difficulties.map((diff) => (
                    <Button
                        key={diff.value}
                        variant="contained"
                        color="primary"
                        onClick={() => handleSelect(diff.value)}
                    >
                        {diff.label}
                    </Button>
                ))}
            </Box>
            <Box sx={{display: 'flex', justifyContent: 'center'}}>
                <DatabaseImport onImportSuccess={handleImportSuccess}/>
            </Box>
        </Box>
    );
};

export default DifficultySelector;