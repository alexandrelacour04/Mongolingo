import React, {useMemo, useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import { Modal, Box, Button, Tabs, Tab, Typography, Paper, CircularProgress } from '@mui/material';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    maxWidth: '800px',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column'
};

const TabPanel = (props) => {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`schema-tabpanel-${index}`}
            aria-labelledby={`schema-tab-${index}`}
            {...other}
            style={{ flexGrow: 1, overflowY: 'auto', marginTop: '16px' }}
        >
            {value === index && (
                <Box sx={{ p: 0 }}>
                    {children}
                </Box>
            )}
        </div>
    );
};

const Home = () => {
    const fixedWidth = useMemo(() => window.innerWidth, []);
    const [schema, setSchema] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTab, setSelectedTab] = useState(0);

    useEffect(() => {
        axios.get('/api/schema').then(res => {
            setSchema(res.data);
            setLoading(false);
        });
    }, []);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);
    const handleTabChange = (event, newValue) => setSelectedTab(newValue);

    const displayableSchemas = useMemo(() => {
        if (!schema) return [];
        const schemaOrder = ["library", "events", "automotive"];
        return Object.entries(schema)
            .filter(([key]) => schemaOrder.includes(key))
            .sort(([keyA], [keyB]) => schemaOrder.indexOf(keyA) - schemaOrder.indexOf(keyB));
    }, [schema]);

    return (
        <div style={{width: fixedWidth, maxWidth: "100vw", margin: "0 auto"}}
             className="flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-4xl mx-auto">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 text-center text-white">
                    Mongolingo
                </h1>
                <div className="flex flex-row gap-4 items-stretch justify-center"> {/* Changed to items-stretch */}
                    {/* Premier bouton */}
                    <Link
                        to="/database-quiz"
                        style={{ textDecoration: 'none' }} // Pour enlever le soulignement du lien
                    >
                        <Button
                            variant="contained"
                            sx={{
                                height: '56px',
                                textTransform: 'none',
                                fontSize: '1.25rem',
                                backgroundColor: '#10B981',
                                padding: '16px 32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                whiteSpace: 'nowrap',
                                margin: '0 auto',
                                marginTop: '16px',
                                fontWeight: 'bold',
                                boxShadow: 2,
                                '&:hover': {
                                    backgroundColor: '#059669',
                                    transform: 'translateY(-2px)',
                                    boxShadow: 4
                                }
                            }}
                        >
                            Commencer le Quiz MongoDB
                        </Button>
                    </Link>

                    {/* Deuxième bouton */}
                    <Button
                        variant="contained"
                        onClick={handleOpenModal}
                        sx={{
                            height: '56px',
                            textTransform: 'none',
                            fontSize: '1.25rem',
                            backgroundColor: '#10B981',
                            padding: '16px 32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            whiteSpace: 'nowrap',
                            margin: '0 auto',
                            marginTop: '16px',
                            '&:hover': {
                                backgroundColor: '#059669'
                            }
                        }}
                    >
                        Voir les Schémas
                    </Button>
                </div>

                <Modal
                    open={isModalOpen}
                    onClose={handleCloseModal}
                    aria-labelledby="schema-modal-title"
                >
                    <Box sx={modalStyle}>
                        <Typography variant="h6" component="h2" sx={{mb: 2, color: 'primary.main'}}>
                            Schémas des Bases de Données
                        </Typography>
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                <CircularProgress />
                                <Typography sx={{ ml: 2 }}>Chargement des schémas...</Typography>
                            </Box>
                        ) : displayableSchemas.length > 0 ? (
                            <>
                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <Tabs value={selectedTab} onChange={handleTabChange}>
                                        {displayableSchemas.map(([schemaName], index) => (
                                            <Tab
                                                label={schemaName.charAt(0).toUpperCase() + schemaName.slice(1)}
                                                key={schemaName}
                                                id={`schema-tab-${index}`}
                                            />
                                        ))}
                                    </Tabs>
                                </Box>
                                {displayableSchemas.map(([schemaName, schemaDefinition], index) => (
                                    <TabPanel value={selectedTab} index={index} key={schemaName}>
                                        {Object.entries(schemaDefinition).map(([collection, definition]) => (
                                            <Paper elevation={2} sx={{ mb: 2, p: 2 }} key={collection}>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                                    Collection: {collection}
                                                </Typography>
                                                <pre className="bg-gray-100 text-black p-2 rounded text-xs whitespace-pre-wrap max-h-60 overflow-auto">
                                                    {JSON.stringify(definition.fields || definition, null, 2)}
                                                </pre>
                                            </Paper>
                                        ))}
                                    </TabPanel>
                                ))}
                            </>
                        ) : (
                            <Typography>Aucun schéma à afficher.</Typography>
                        )}
                        <Button variant="contained" onClick={handleCloseModal} color="primary"
                                sx={{mt: 2, alignSelf: 'flex-end'}}>
                        Fermer
                        </Button>
                    </Box>
                </Modal>
            </div>
        </div>
    );
};

export default Home;