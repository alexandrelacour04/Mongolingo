// src/components/LifeCounter.jsx
import React from 'react';
import { Box } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';

const LifeCounter = ({ lives }) => {
    return (
        <Box sx={{
            display: 'flex',
            gap: 1,
            position: 'fixed',
            top: 20,
            right: 20,
            zIndex: 1000
        }}>
            {[...Array(3)].map((_, index) => (
                <FavoriteIcon
                    key={index}
                    sx={{
                        fontSize: 40,
                        color: index < lives ? '#ff0000' : '#cccccc',
                        filter: index < lives ? 'drop-shadow(0 0 2px rgba(255,0,0,0.5))' : 'none'
                    }}
                />
            ))}
        </Box>
    );
};

export default LifeCounter;