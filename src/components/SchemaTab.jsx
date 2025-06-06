import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SchemaTab = () => {
    const [schema, setSchema] = useState(null);

    useEffect(() => {
        axios.get('/api/schema').then(res => setSchema(res.data));
    }, []);

    if (!schema) return <div>Chargement du schéma...</div>;

    return (
        <div className="bg-white rounded p-4 max-h-[60vh] overflow-auto mt-4 mb-2">
            <h2 className=" text-xl mb-2">Schéma de la base de données</h2>
            <div className="overflow-auto">
                {Object.entries(schema).map(([collection, def]) => (
                    <div key={collection} className="mb-6">
                        <h3 className="font-semibold text-blue-600">{collection}</h3>
                        <pre className="bg-gray-100 p-3 rounded">
              {JSON.stringify(def, null, 2)}
            </pre>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SchemaTab;