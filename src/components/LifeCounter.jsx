// src/components/LifeCounter.jsx
import React from 'react';
import {Box} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';

/**
 * LifeCounter component displays the remaining lives as heart icons
 *
 * @component
 * @param {Object} props - Component properties
 * @param {number} props.lives - Number of remaining lives (max 3)
 * @returns {JSX.Element} A box containing heart icons representing lives
 */
const LifeCounter = ({lives}) => {
    return (
        // Container box fixed at the top
        <Box sx={{
            display: 'flex',
            gap: 1,
            position: 'fixed',
            zIndex: 1000
        }}>
            {/* Generate 3 heart icons */}
            {[...Array(3)].map((_, index) => (
                <FavoriteIcon
                    key={index}
                    sx={{
                        fontSize: 40,
                        // Red for active lives, grey for lost lives
                        color: index < lives ? '#ff0000' : '#cccccc',
                        // Add glow effect only on active lives
                        filter: index < lives ? 'drop-shadow(0 0 2px rgba(255,0,0,0.5))' : 'none'
                    }}
                />
            ))}
        </Box>
    );
};

export default LifeCounter;