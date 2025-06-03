import {createTheme} from '@mui/material/styles';

// Définition des couleurs principales
export const colors = {
    primary: '#3498db',
    primaryDark: '#2980b9',
    secondary: '#2980b9',
    background: '#f0f8ff',
    border: '#bdc3c7',
    success: '#2ecc71',
    error: '#e74c3c',
    white: '#ffffff',
};
// Création du thème personnalisé
export const theme = createTheme({
    palette: {
        primary: {
            main: colors.primary,
            dark: colors.primaryDark,
            contrastText: colors.white
        },
        secondary: {
            main: colors.secondary,
        },
        background: {
            default: colors.background,
            paper: colors.white,
        },
    },
    typography: {
        fontFamily: 'Din Round, sans-serif',
        button: {
            textTransform: 'none',
            fontWeight: 700,
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
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '12px',
                    padding: '12px 24px',
                    boxShadow: `0 4px 0 0 ${colors.primaryDark}`,
                    '&:hover': {
                        boxShadow: `0 6px 0 0 ${colors.primaryDark}`,
                        transform: 'translateY(-2px)',
                    },
                },
            },
        },
    },
});

// Styles globaux pour l'application
export const globalStyles = {
    body: {
        margin: 0,
        minHeight: '100vh',
        width: '100%',
        backgroundColor: colors.background,
        fontFamily: 'Din Round, sans-serif',
    },
    root: {
        width: '100%',
        minHeight: '100vh',
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    quizContainer: {
        width: '100%',
        maxWidth: '800px',
        margin: '2rem auto',
        padding: '2rem',
        background: colors.white,
        borderRadius: '16px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    answerZone: {
        minHeight: '100px',
        border: `2px solid ${colors.border}`,
        padding: '1rem',
        borderRadius: '12px',
        backgroundColor: colors.white,
        margin: '1rem 0',
        transition: 'all 0.3s ease',
        '&:focus-within': {
            borderColor: colors.primary,
            boxShadow: '0 0 0 4px rgba(88, 204, 2, 0.1)',
        },
    },
    dragChip: {
        backgroundColor: `${colors.white} !important`,
        border: `2px solid ${colors.primary} !important`,
        borderRadius: '12px !important',
        padding: '8px 16px !important',
        fontWeight: 700,
        cursor: 'grab !important',
        transition: 'all 0.2s ease !important',
        '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        },
    },
};