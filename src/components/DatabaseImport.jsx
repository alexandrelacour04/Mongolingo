// src/components/DatabaseImport.jsx
import React, {useState, useEffect} from 'react';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from '@mui/material';
import axios from 'axios';

/**
 * Database import component that allows users to import JSON or BSON database files
 * @param {Object} props Component properties
 * @param {Function} props.onImportSuccess Callback function called when database is successfully imported
 * @returns {JSX.Element} Rendered database import component
 */
const DatabaseImport = ({onImportSuccess}) => {
    const [open, setOpen] = useState(false);
    const [error, setError] = useState(null);
    const [importing, setImporting] = useState(false);
    const [format, setFormat] = useState('json');
    const [sessionId, setSessionId] = useState(null);

    /**
     * Cleans up temporary database on component unmount
     */
    const cleanupDatabase = async () => {
        if (sessionId) {
            try {
                await axios.delete(`/api/database/cleanup/${sessionId}`);
            } catch (error) {
                console.error('Erreur lors du nettoyage:', error);
            }
        }
    };

    useEffect(() => {
        const handleBeforeUnload = () => {
            cleanupDatabase();
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            cleanupDatabase();
        };
    }, [sessionId]);

    /**
     * Handles file upload and database import
     * @param {Event} event File input change event
     */
    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            setImporting(true);
            setError(null);

            const formData = new FormData();
            formData.append('database', file);
            formData.append('format', format);

            const response = await axios.post('/api/database/import', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                setSessionId(response.data.sessionId);
                setOpen(false);
                onImportSuccess(response.data.database);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de l\'importation');
        } finally {
            setImporting(false);
        }
    };

    return (
        <>
            <Button
                variant="contained"
                onClick={() => setOpen(true)}
                sx={{
                    borderColor: '#10B981',
                    color: '#FFFFFFFF'
                }}
            >
                Importer une base de données
            </Button>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Importer une base de données</DialogTitle>
                <DialogContent>
                    <Typography variant="body1" gutterBottom>
                        Sélectionnez un fichier contenant votre base de données.
                    </Typography>

                    <FormControl fullWidth sx={{my: 2}}>
                        <InputLabel>Format</InputLabel>
                        <Select
                            value={format}
                            label="Format"
                            onChange={(e) => setFormat(e.target.value)}
                        >
                            <MenuItem value="json">JSON</MenuItem>
                            <MenuItem value="bson">BSON</MenuItem>
                        </Select>
                    </FormControl>

                    <input
                        type="file"
                        accept={format === 'json' ? '.json' : '.bson'}
                        onChange={handleFileUpload}
                        style={{margin: '20px 0'}}
                    />
                    {error && (
                        <Typography color="error" variant="body2">
                            {error}
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} disabled={importing}>
                        Annuler
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default DatabaseImport;