import React, {useEffect, useState} from "react";
import axios from "axios";

export default function Leaderboard({difficulty}) {
    const [scores, setScores] = useState([]);

    useEffect(() => {
        async function fetchScores() {
            const res = await axios.get(`/api/scores/top/${difficulty}`);
            setScores(res.data);
        }

        fetchScores();
    }, [difficulty]);

    return (
        <div>
            <h2 className="text-xl font-bold mb-2">Top 3 - Niveau {difficulty}</h2>
            <ul>
                {scores.map((entry, idx) => (
                    <li key={idx}>
                        <strong>{entry.pseudo}</strong> : {entry.score} points
                    </li>
                ))}
            </ul>
        </div>
    );
}