import React, {useMemo} from 'react';
import {Link} from 'react-router-dom';

const Home = () => {
    const fixedWidth = useMemo(() => window.innerWidth, []);

    return (
        <div style={{width: fixedWidth, maxWidth: "100vw", margin: "0 auto"}}
             className="flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-4xl mx-auto">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 text-center text-white">
                    Mongolingo
                </h1>
                <div className="flex flex-col gap-4 items-center">
                    <Link
                        to="/database-quiz"
                        className="bg-white text-blue-600 px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 text-xl font-bold"
                    >
                        <button type="button">Commencer le Quiz MongoDB</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;