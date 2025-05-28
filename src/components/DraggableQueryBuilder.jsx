// src/components/DraggableQueryBuilder.jsx
import React, {useState, useEffect} from 'react';
import {
    Box,
    Chip,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
    Alert
} from '@mui/material';
import {DragDropContext, Droppable, Draggable} from '@hello-pangea/dnd';

const DraggableQueryBuilder = ({expectedQuery, onSubmit}) => {
    const [blocks, setBlocks] = useState([]);
    const [answerBlocks, setAnswerBlocks] = useState([]);
    const [openErrorDialog, setOpenErrorDialog] = useState(false);
    const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
    const [lastAnswer, setLastAnswer] = useState('');
    const [feedback, setFeedback] = useState('');

    useEffect(() => {
        const parseExpectedQuery = (query) => {
            const blocks = [];
            const timestamp = Date.now();

            const addBlock = (content, index) => {
                blocks.push({
                    id: `${content}-${timestamp}-${index}-${Math.random().toString(36).substr(2, 9)}`,
                    content: content,
                    isOperator: content.startsWith('$'),
                    isCollection: ['members', 'classes', 'bookings'].includes(content),
                    isMethod: ['find', 'aggregate', 'sort', 'project', 'match', 'group', 'lookup', 'unwind'].includes(content)
                });
            };

            let current = '';
            let i = 0;
            let blockIndex = 0;

            while (i < query.length) {
                if (query[i] === '.') {
                    if (current) {
                        addBlock(current, blockIndex++);
                        current = '';
                    }
                    addBlock('.', blockIndex++);
                } else if (query[i] === '(' || query[i] === ')' || query[i] === '{' || query[i] === '}') {
                    if (current) {
                        addBlock(current, blockIndex++);
                        current = '';
                    }
                    addBlock(query[i], blockIndex++);
                } else if (query[i] === '$') {
                    if (current) {
                        addBlock(current, blockIndex++);
                        current = '';
                    }
                    let operator = '$';
                    i++;
                    while (i < query.length && /[a-zA-Z]/.test(query[i])) {
                        operator += query[i];
                        i++;
                    }
                    addBlock(operator, blockIndex++);
                    continue;
                } else if (query[i] === "'") {
                    if (current) {
                        addBlock(current, blockIndex++);
                        current = '';
                    }
                    let str = "'";
                    i++;
                    while (i < query.length && query[i] !== "'") {
                        str += query[i];
                        i++;
                    }
                    str += "'";
                    addBlock(str, blockIndex++);
                    i++;
                    continue;
                } else if (/[a-zA-Z0-9]/.test(query[i])) {
                    current += query[i];
                } else if (query[i] === ' ' || query[i] === ':') {
                    if (current) {
                        addBlock(current, blockIndex++);
                        current = '';
                    }
                    if (query[i] === ':') {
                        addBlock(':', blockIndex++);
                    }
                }
                i++;
            }

            if (current) {
                addBlock(current, blockIndex++);
            }

            return blocks;
        };

        const shuffleArray = (array) => {
            const newArray = [...array];
            for (let i = newArray.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
            }
            return newArray;
        };

        const queryBlocks = parseExpectedQuery(expectedQuery);
        setBlocks(shuffleArray(queryBlocks));
        setAnswerBlocks([]);
    }, [expectedQuery]);

    const handleDragEnd = (result) => {
        const {source, destination} = result;

        if (!destination) return;

        const start = source.droppableId;
        const finish = destination.droppableId;

        if (start === finish) {
            const items = start === 'blocks' ? [...blocks] : [...answerBlocks];
            const [reorderedItem] = items.splice(source.index, 1);
            items.splice(destination.index, 0, {
                ...reorderedItem,
                id: `${reorderedItem.content}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
            });

            if (start === 'blocks') {
                setBlocks(items);
            } else {
                setAnswerBlocks(items);
            }
        } else {
            const sourceItems = start === 'blocks' ? [...blocks] : [...answerBlocks];
            const destItems = finish === 'blocks' ? [...blocks] : [...answerBlocks];
            const [movedItem] = sourceItems.splice(source.index, 1);

            const newItem = {
                ...movedItem,
                id: `${movedItem.content}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
            };

            destItems.splice(destination.index, 0, newItem);

            if (start === 'blocks') {
                setBlocks(sourceItems);
                setAnswerBlocks(destItems);
            } else {
                setBlocks(destItems);
                setAnswerBlocks(sourceItems);
            }
        }
    };

    const handleSubmit = () => {
        const answer = answerBlocks.map(block => block.content).join('');
        setLastAnswer(answer);

        if (answer === expectedQuery) {
            setOpenSuccessSnackbar(true);
            setFeedback("Excellent ! Votre réponse est correcte.");
            onSubmit(answer, true);
        } else {
            setFeedback("La réponse n'est pas correcte. Voulez-vous réessayer ?");
            setOpenErrorDialog(true);
        }
    };

    const handleCloseErrorDialog = () => {
        setOpenErrorDialog(false);
    };

    const handleRetry = () => {
        setOpenErrorDialog(false);
        const returnedBlocks = [...blocks, ...answerBlocks.map(block => ({
            ...block,
            id: `${block.content}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        }))];
        setBlocks(returnedBlocks);
        setAnswerBlocks([]);
    };

    const handleCloseSuccessSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSuccessSnackbar(false);
    };

    const getChipColor = (block) => {
        if (block.isOperator) return 'secondary';
        if (block.isCollection) return 'success';
        if (block.isMethod) return 'info';
        return 'primary';
    };

    return (
        <>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Box sx={{mb: 2}}>
                    <Droppable droppableId="blocks" direction="horizontal">
                        {(provided) => (
                            <Paper
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                sx={{
                                    p: 2,
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: 1,
                                    minHeight: 60,
                                    backgroundColor: '#f5f5f5'
                                }}
                            >
                                {blocks.map((block, index) => (
                                    <Draggable
                                        key={block.id}
                                        draggableId={block.id}
                                        index={index}
                                    >
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                <Chip
                                                    label={block.content}
                                                    color={getChipColor(block)}
                                                    variant="filled"
                                                    sx={{m: 0.5}}
                                                />
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </Paper>
                        )}
                    </Droppable>
                </Box>

                <Box sx={{mb: 2}}>
                    <Droppable droppableId="answer" direction="horizontal">
                        {(provided) => (
                            <Paper
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                sx={{
                                    p: 2,
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: 1,
                                    minHeight: 60,
                                    border: '2px dashed #1976d2',
                                    backgroundColor: '#f8f8f8'
                                }}
                            >
                                {answerBlocks.map((block, index) => (
                                    <Draggable
                                        key={block.id}
                                        draggableId={block.id}
                                        index={index}
                                    >
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                <Chip
                                                    label={block.content}
                                                    color={getChipColor(block)}
                                                    variant="filled"
                                                    sx={{m: 0.5}}
                                                />
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </Paper>
                        )}
                    </Droppable>
                </Box>

                <Box sx={{display: 'flex', justifyContent: 'center'}}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        disabled={answerBlocks.length === 0}
                    >
                        Vérifier la réponse
                    </Button>
                </Box>
            </DragDropContext>

            <Dialog
                open={openErrorDialog}
                onClose={handleCloseErrorDialog}
                aria-labelledby="error-dialog-title"
                aria-describedby="error-dialog-description"
            >
                <DialogTitle id="error-dialog-title" sx={{color: 'error.main'}}>
                    Réponse incorrecte
                </DialogTitle>
                <DialogContent>
                    <Box sx={{mb: 2}}>
                        {feedback}
                    </Box>
                    <Box sx={{backgroundColor: 'grey.100', p: 2, borderRadius: 1, mb: 2}}>
                        <strong>Votre réponse :</strong> {lastAnswer}
                    </Box>
                    <Box sx={{backgroundColor: 'success.light', p: 2, borderRadius: 1}}>
                        <strong>Réponse correcte :</strong> {expectedQuery}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            handleCloseErrorDialog();
                            onSubmit(lastAnswer, false);
                        }}
                        color="primary"
                        variant="contained"
                    >
                        Question suivante
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={openSuccessSnackbar}
                autoHideDuration={3000}
                onClose={handleCloseSuccessSnackbar}
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
            >
                <Alert
                    onClose={handleCloseSuccessSnackbar}
                    severity="success"
                    variant="filled"
                    sx={{width: '100%'}}
                >
                    {feedback}
                </Alert>
            </Snackbar>
        </>
    );
};

export default DraggableQueryBuilder;