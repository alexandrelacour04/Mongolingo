import React from "react";
import {Button, Box} from "@mui/material";

const DifficultySelector = ({onSelect}) => {
    // Mapping entre difficulté et base de données 
    const difficulties = [
        {label: "Facile", value: "facile", database: "automotive"},
        {label: "Moyen", value: "moyen", database: "events"},
        {label: "Difficile", value: "difficile", database: "library"}
    ];

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