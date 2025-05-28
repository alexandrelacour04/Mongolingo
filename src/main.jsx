import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import App from './App';
import './index.css';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2', // Bleu principal
        },
        secondary: {
            main: '#dc004e', // Rose secondaire
        },
    },
    typography: {
        fontFamily: 'Roboto, Arial, sans-serif',
    },
});

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <App />
        </ThemeProvider>
    </React.StrictMode>
);

