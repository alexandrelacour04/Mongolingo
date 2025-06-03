import React from 'react';
import ReactDOM from 'react-dom/client';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import App from './App';
import './index.css';

// Création du thème personnalisé style Duolingo
const theme = createTheme({
    palette: {
        primary: {
            main: '#58CC02', // Le vert caractéristique de Duolingo
            contrastText: '#fff'
        },
        secondary: {
            main: '#FF4B4B', // Le rouge pour les erreurs et les cœurs de vie
        },
        background: {
            default: '#fff',
            paper: '#fff',
        },
    },
    typography: {
        // Police de caractère similaire à celle de Duolingo
        fontFamily: 'Din Round, sans-serif',
        button: {
            textTransform: 'none', // Évite les majuscules automatiques
            fontWeight: 700, // Texte en gras
        },
        h1: {
            fontWeight: 700,
            fontSize: '2rem',
        },
        h2: {
            fontWeight: 700,
            fontSize: '1.5rem',
        },
    },
    components: {
        // Style personnalisé pour les boutons
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '12px',
                    padding: '12px 24px',
                    boxShadow: '0 4px 0 0 #45a100', // Ombre caractéristique de Duolingo
                    '&:hover': {
                        boxShadow: '0 6px 0 0 #45a100',
                        transform: 'translateY(-2px)', // Effet de soulèvement au survol
                    },
                },
            },
        },
    },
});

// Rendu de l'application avec le thème personnalisé
ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <App/>
        </ThemeProvider>
    </React.StrictMode>
);