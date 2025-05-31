import React from "react";
import {Button, Box} from "@mui/material";

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
        <Box
            sx={{
                display: "flex",
                gap: 2,
                justifyContent: "center",
                mt: 2,
                mb: 2,
            }}
        >
            {/* Map through difficulties array to render buttons */}
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
    );
};

export default DifficultySelector;