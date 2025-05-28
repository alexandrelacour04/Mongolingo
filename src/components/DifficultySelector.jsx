import React from 'react';

const DifficultySelector = ({ onSelect }) => {
    // Mapping entre difficulté et base de données
    const difficultyToDb = {
        facile: 'automotive',
        moyen: 'events',
        difficile: 'library'
    };

    // Lorsque l'utilisateur clique sur une difficulté, on transmet la difficulté et la base correspondante
    const handleSelect = (difficulty) => {
        const database = difficultyToDb[difficulty];
        // onSelect est une fonction passée par le parent qui reçoit { difficulty, database }
        if (onSelect) {
            onSelect({ difficulty, database });
        }
    };

    return (
        <div className="flex justify-around">
            <button
                className="bg-green-400 hover:bg-green-500 text-white px-4 py-2 rounded"
                onClick={() => handleSelect('facile')}
            >
                Facile
            </button>
            <button
                className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded"
                onClick={() => handleSelect('moyen')}
            >
                Moyen
            </button>
            <button
                className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => handleSelect('difficile')}
            >
                Difficile
            </button>
        </div>
    );
};

export default DifficultySelector;