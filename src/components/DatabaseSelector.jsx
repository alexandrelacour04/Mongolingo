import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DatabaseSelector = ({ onDatabaseSelect }) => {
    const [databases, setDatabases] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDatabases = async () => {
            try {
                setIsLoading(true);
                // Assurez-vous que l'URL correspond bien à l'adresse du serveur backend.
                const response = await axios.get('http://localhost:5000/api/databases/list');
                setDatabases(response.data);
                setError(null);
            } catch (err) {
                console.error('Erreur lors de la récupération des bases de données:', err);
                setError('Impossible de charger les bases de données');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDatabases();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="grid gap-4">
            {databases.map((db) => (
                <button
                    key={db.name}
                    onClick={() => onDatabaseSelect(db.name)}
                    className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-all"
                >
                    <h3 className="text-lg font-bold text-gray-800">{db.name}</h3>
                    <p className="text-gray-600">{db.description}</p>
                </button>
            ))}
        </div>
    );
};

export default DatabaseSelector;