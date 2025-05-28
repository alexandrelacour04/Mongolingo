import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import DatabaseQuiz from './pages/DatabaseQuiz';

function App() {
    return (
        <Router>
            <div className="min-h-screen w-full bg-gradient-to-br from-blue-600 to-blue-300">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/database-quiz" element={<DatabaseQuiz />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;