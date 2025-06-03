/**
 * DraggableQueryBuilder.jsx
 * Component that provides a drag-and-drop interface for building MongoDB queries
 */
import React, {useEffect, useState} from 'react';
import {
    Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Fade, Paper, Typography
} from '@mui/material';
import {styled} from '@mui/material/styles';
import {DragDropContext, Draggable, Droppable} from '@hello-pangea/dnd';
import axios from "axios";

/**
 * Styled component for the query construction area
 */
const QueryBox = styled(Paper)(({theme}) => ({
    padding: theme.spacing(2),
    backgroundColor: '#f7f9fa',
    borderRadius: '12px',
    border: '2px dashed #e5e5e5',
    minHeight: 100,
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: '8px',
    '&:hover': {
        borderColor: theme.palette.primary.main, backgroundColor: '#f0f7f0',
    },
}));

/**
 * Formats a MongoDB query string by adding consistent spacing
 * @param {string} str - Raw query string
 * @returns {string} Formatted query string
 */
function formatMongoQuery(str) {
    return str
        .replace(/\{\s*/g, '{ ')
        .replace(/\s*\}/g, ' }')
        .replace(/:(?=\S)/g, ': ')
        .replace(/(?<=\S):/g, ' :')
        .replace(/\s+/g, ' ')
        .trim();
}

// Accept both 'db.collection.find({...})' and '{...}'
function extractJsonFromShell(str) {
    const shellMatch = str.match(/^db\.\w+\.\w+\((.*)\)$/s);
    if (shellMatch) {
        return shellMatch[1];
    }
    return str;
}

/**
 * Styled component for displaying code snippets
 */
const CodeBox = styled(Paper)(({theme}) => ({
    padding: theme.spacing(2),
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
    border: '1px solid #e0e0e0',
    marginBottom: theme.spacing(2),
    fontFamily: 'monospace',
    overflowX: 'auto'
}));

/**
 * Styled container for draggable query blocks
 */
const BlocksContainer = styled(Box)(({theme}) => ({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '12px',
    padding: theme.spacing(2),
    backgroundColor: '#fff',
    borderRadius: '12px',
    marginTop: theme.spacing(2),
}));

/**
 * Parses a query string into draggable blocks
 * @param {string} query - Query string to parse
 * @returns {Array} Array of block objects with id and content
 */
const parseQuery = (query) => {
    const blocks = [];
    let buffer = "";
    let blockIndex = 0;

    for (let i = 0; i < query.length; i++) {
        const c = query[i];
        if (".(){}:".includes(c)) {
            if (buffer) {
                blocks.push({
                    id: `${buffer}-${blockIndex++}`, content: buffer,
                });
                buffer = "";
            }
            blocks.push({
                id: `${c}-${blockIndex++}`, content: c,
            });
        } else if (c === "'") {
            if (buffer) {
                blocks.push({
                    id: `${buffer}-${blockIndex++}`, content: buffer,
                });
                buffer = "";
            }
            let str = "'";
            i++;
            while (i < query.length && query[i] !== "'") {
                str += query[i++];
            }
            str += "'";
            blocks.push({
                id: `${str}-${blockIndex++}`, content: str,
            });
        } else if (c.trim() === "") {
            if (buffer) {
                blocks.push({
                    id: `${buffer}-${blockIndex++}`, content: buffer,
                });
                buffer = "";
            }
        } else {
            buffer += c;
        }
    }
    if (buffer) {
        blocks.push({
            id: `${buffer}-${blockIndex++}`, content: buffer,
        });
    }
    return blocks;
};

/**
 * Shuffles array elements randomly
 * @param {Array} arr - Array to shuffle
 * @returns {Array} New shuffled array
 */
const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};

/**
 * Main component for building MongoDB queries through drag and drop
 * @param {Object} props Component props
 * @param {string} props.expectedQuery - The correct query to match
 * @param {Function} props.onSubmit - Callback when query is submitted
 * @param {Function} props.onLifeLost - Callback when incorrect answer is given
 */
const DraggableQueryBuilder = ({
                                   expectedQuery, onSubmit, dbName = "automotive", collection = "classes"
                               }) => {
    const [blocks, setBlocks] = useState([]); // Available blocks
    const [answerBlocks, setAnswerBlocks] = useState([]); // Blocks in answer area
    const [openDialog, setOpenDialog] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [lastAnswer, setLastAnswer] = useState('');
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [dbExecResult, setDbExecResult] = useState(null);
    const [dbExecLoading, setDbExecLoading] = useState(false);

    /**
     * Handles displaying the result of the expected query
     */
    const showQueryResult = async () => {
        setDbExecLoading(true);
        try {
            // Extract collection name from expectedQuery if it contains one
            const collectionMatch = expectedQuery.match(/db\.(\w+)\./);
            const queryCollection = collectionMatch ? collectionMatch[1] : collection;

            // Extract dbName from expectedQuery if it contains one in a comment like /* dbName: library */
            const dbNameMatch = expectedQuery.match(/\/\*\s*dbName:\s*(\w+)\s*\*\//);
            const queryDbName = dbNameMatch ? dbNameMatch[1] : dbName;

            const shellQuery = `db.${queryCollection}.find(${extractJsonFromShell(expectedQuery)})`;
            const payload = {
                dbName: queryDbName,
                shellQuery,
            };
            const res = await axios.post('/api/database/execute', payload);
            setDbExecResult({
                success: true,
                count: Array.isArray(res.data.data) ? res.data.data.length : 0,
                data: res.data.data
            });
        } catch (e) {
            setDbExecResult({
                success: false,
                error: e.response?.data?.error || e.message
            });
        }
        setDbExecLoading(false);
    };

    // Initialize blocks when expectedQuery changes
    useEffect(() => {
        const parsed = parseQuery(expectedQuery);
        setBlocks(shuffle(parsed));
        setAnswerBlocks([]);
        setHasSubmitted(false);
    }, [expectedQuery]);

    /**
     * Handles double-click on blocks to move them to answer area
     */
    const handleBlockDoubleClick = (block, index) => {
        setBlocks(prevBlocks => {
            const newBlocks = [...prevBlocks];
            newBlocks.splice(index, 1);
            return newBlocks;
        });
        setAnswerBlocks(prevAnswerBlocks => [...prevAnswerBlocks, block]);
    };

    /**
     * Handles end of drag operations
     */
    const handleDragEnd = (result) => {
        if (!result.destination) return;
        const {source, destination} = result;

        if (source.droppableId === destination.droppableId) {
            const items = source.droppableId === 'blocks' ? [...blocks] : [...answerBlocks];
            const [reordered] = items.splice(source.index, 1);
            items.splice(destination.index, 0, reordered);
            if (source.droppableId === 'blocks') setBlocks(items); else setAnswerBlocks(items);
        } else {
            const sourceItems = source.droppableId === 'blocks' ? [...blocks] : [...answerBlocks];
            const destItems = destination.droppableId === 'blocks' ? [...blocks] : [...answerBlocks];
            const [moved] = sourceItems.splice(source.index, 1);
            destItems.splice(destination.index, 0, moved);
            if (source.droppableId === 'blocks') {
                setBlocks(sourceItems);
                setAnswerBlocks(destItems);
            } else {
                setBlocks(destItems);
                setAnswerBlocks(sourceItems);
            }
        }
    };

    /**
     * Handles query submission and validation AND DB execution
     */
    const handleSubmit = async () => {
        let answer = answerBlocks.map(block => block.content).join('');
        setLastAnswer(answer);
        const isAnswerCorrect = formatMongoQuery(answer) === formatMongoQuery(expectedQuery);
        setIsCorrect(isAnswerCorrect);
        await showQueryResult();
        setOpenDialog(true);
        setHasSubmitted(true);
    };

    /**
     * Handles dialog close and triggers appropriate callbacks
     */
    const handleCloseDialog = () => {
        setOpenDialog(false);
        onSubmit(lastAnswer);

    };

    return (<DragDropContext onDragEnd={handleDragEnd}>
        <Box sx={{mb: 4}}>
            <Typography
                variant="h6"
                sx={{
                    mb: 2, color: '#333333', fontWeight: 'bold'
                }}
            >
                Zone de construction
            </Typography>

            <Droppable droppableId="answer" direction="horizontal">
                {(provided) => (<QueryBox
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                >
                    {answerBlocks.map((block, index) => (<Fade in key={block.id} timeout={300}>
                        <div>
                            <Draggable
                                draggableId={block.id}
                                index={index}
                            >
                                {(provided, snapshot) => (<div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                >
                                    <Chip
                                        label={block.content}
                                        sx={{
                                            backgroundColor: snapshot.isDragging ? '#e8f5e9' : '#fff',
                                            border: (theme) => `2px solid ${theme.palette.primary.main}`,
                                            borderRadius: '8px',
                                            padding: '8px 4px',
                                            fontWeight: 'bold',
                                            '&:hover': {
                                                backgroundColor: '#f0f7f0',
                                                transform: 'translateY(-2px)',
                                                transition: 'transform 0.2s ease',
                                            }
                                        }}
                                    />
                                </div>)}
                            </Draggable>
                        </div>
                    </Fade>))}
                    {provided.placeholder}
                </QueryBox>)}
            </Droppable>

            <Box sx={{display: 'flex', justifyContent: 'center', mt: 2, gap: 2}}>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={answerBlocks.length === 0}
                    sx={{
                        minWidth: '200px', fontSize: '1.1rem'
                    }}
                >
                    Vérifier
                </Button>
            </Box>

            <Typography
                variant="h6"
                sx={{
                    mt: 4, mb: 2, color: '#333333', fontWeight: 'bold'
                }}
            >
                Blocs disponibles
            </Typography>

            <Droppable droppableId="blocks" direction="horizontal">
                {(provided) => (<BlocksContainer
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{
                        display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center'
                    }}
                >
                    {blocks.map((block, index) => (<Draggable
                        key={block.id}
                        draggableId={block.id}
                        index={index}
                    >
                        {(provided, snapshot) => (<div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                        >
                            <Chip
                                label={block.content}
                                onDoubleClick={() => handleBlockDoubleClick(block, index)}
                                sx={{
                                    backgroundColor: snapshot.isDragging ? '#e8f5e9' : '#fff',
                                    border: (theme) => `2px solid ${theme.palette.primary.main}`,
                                    borderRadius: '8px',
                                    padding: '8px 4px',
                                    fontWeight: 'bold',
                                    '&:hover': {
                                        backgroundColor: '#f0f7f0',
                                        transform: 'translateY(-2px)',
                                        transition: 'transform 0.2s ease',
                                    }
                                }}
                            />
                        </div>)}
                    </Draggable>))}
                    {provided.placeholder}
                </BlocksContainer>)}
            </Droppable>
        </Box>

        {/* Results Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>
                {isCorrect ? "Bonne réponse !" : "Mauvaise réponse"}
            </DialogTitle>
            <DialogContent>
                <Typography>
                    {isCorrect ? "Vous avez construit la requête correctement." : "La requête n'est pas correcte. Réessayez !"}
                </Typography>
                {/* Chargement */}
                {dbExecLoading && (<Typography sx={{mt: 2}} color="info.main">
                    Exécution MongoDB en cours...
                </Typography>)}
                {/* Résultat de la requête côté mongo */}
                {dbExecResult && dbExecResult.success && (<Box sx={{mt: 2}}>
                    <Typography color="success.main">
                        ✔ Succès MongoDB : {dbExecResult.count} document(s) trouvé(s).
                    </Typography>
                    <Paper variant="outlined"
                           sx={{maxHeight: 180, overflow: "auto", mt: 1, p: 1, background: "#f9f9f9"}}>
                                <pre style={{margin: 0, fontSize: "0.85em"}}>
                                    {JSON.stringify(dbExecResult.data, null, 2)}
                                </pre>
                    </Paper>
                </Box>)}
                {dbExecResult && !dbExecResult.success && (<Typography sx={{mt: 2}} color="error">
                    Erreur MongoDB&nbsp;: {dbExecResult.error}
                </Typography>)}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseDialog} autoFocus>
                    Fermer
                </Button>
            </DialogActions>
        </Dialog>
    </DragDropContext>);
};

export default DraggableQueryBuilder;