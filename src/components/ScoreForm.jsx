import React, {useState} from "react";
import axios from "axios";

export default function ScoreForm({score, difficulty, database, onScoreSaved}) {
    const [pseudo, setPseudo] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const response = await axios.post("/api/scores", {
                pseudo,
                password,
                score,
                difficulty,
                database
            });
            setMessage("Score enregistré !");
            if (onScoreSaved) onScoreSaved(response.data.top3);
        } catch (error) {
            setMessage(error.response?.data?.error || "Erreur lors de l'enregistrement.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-lg font-bold">Enregistrer votre score</h2>
            <input
                placeholder="Pseudo"
                value={pseudo}
                onChange={e => setPseudo(e.target.value)}
                required
                className="border p-1"
            />
            <input
                placeholder="Mot de passe"
                value={password}
                onChange={e => setPassword(e.target.value)}
                type="password"
                required
                className="border p-1"
            />
            <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit">
                Sauvegarder
            </button>
            {message && <div className="mt-2 text-sm">{message}</div>}
        </form>
    );
}