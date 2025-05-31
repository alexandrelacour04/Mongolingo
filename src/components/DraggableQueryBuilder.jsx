import React, {useState, useEffect} from 'react';
import {
    Box,
    Chip,
    Paper,
    Typography,
    Fade,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import {styled} from '@mui/material/styles';
import {DragDropContext, Droppable, Draggable} from '@hello-pangea/dnd';
import LightbulbIcon from "@mui/icons-material/Lightbulb";

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
        borderColor: theme.palette.primary.main,
        backgroundColor: '#f0f7f0',
    },
}));


function formatMongoQuery(str) {
    return str
        .replace(/\{\s*/g, '{ ')
        .replace(/\s*\}/g, ' }')
        .replace(/:(?=\S)/g, ': ')
        .replace(/(?<=\S):/g, ' :')
        .replace(/\s+/g, ' ')
        .trim();
}

const CodeBox = styled(Paper)(({theme}) => ({
    padding: theme.spacing(2),
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
    border: '1px solid #e0e0e0',
    marginBottom: theme.spacing(2),
    fontFamily: 'monospace',
    overflowX: 'auto'
}));

const BlocksContainer = styled(Box)(({theme}) => ({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '12px',
    padding: theme.spacing(2),
    backgroundColor: '#fff',
    borderRadius: '12px',
    marginTop: theme.spacing(2),
}));

const parseQuery = (query) => {
    // Parsing simple pour diviser le query en blocs (même logique mais externalisée).
    const blocks = [];
    let buffer = "";
    let blockIndex = 0;
    for (let i = 0; i < query.length; i++) {
        const c = query[i];
        if (".(){}:".includes(c)) {
            if (buffer) {
                blocks.push({
                    id: `${buffer}-${blockIndex++}`,
                    content: buffer,
                });
                buffer = "";
            }
            blocks.push({
                id: `${c}-${blockIndex++}`,
                content: c,
            });
        } else if (c === "'") {
            if (buffer) {
                blocks.push({
                    id: `${buffer}-${blockIndex++}`,
                    content: buffer,
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
                id: `${str}-${blockIndex++}`,
                content: str,
            });
        } else if (c.trim() === "") {
            if (buffer) {
                blocks.push({
                    id: `${buffer}-${blockIndex++}`,
                    content: buffer,
                });
                buffer = "";
            }
        } else {
            buffer += c;
        }
    }
    if (buffer) {
        blocks.push({
            id: `${buffer}-${blockIndex++}`,
            content: buffer,
        });
    }
    return blocks;
};

const shuffle = (arr) => {
    // Mélange les blocs
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};

const DraggableQueryBuilder = ({expectedQuery, onSubmit, onLifeLost}) => {
    const [blocks, setBlocks] = useState([]);
    const [answerBlocks, setAnswerBlocks] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [lastAnswer, setLastAnswer] = useState('');

    useEffect(() => {
        const parsed = parseQuery(expectedQuery);
        setBlocks(shuffle(parsed));
        setAnswerBlocks([]);
    }, [expectedQuery]);

    const handleDragEnd = (result) => {
        if (!result.destination) return;
        const {source, destination} = result;
        if (source.droppableId === destination.droppableId) {
            const items = source.droppableId === 'blocks' ? [...blocks] : [...answerBlocks];
            const [reordered] = items.splice(source.index, 1);
            items.splice(destination.index, 0, reordered);
            if (source.droppableId === 'blocks') setBlocks(items);
            else setAnswerBlocks(items);
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

    const handleSubmit = () => {
        const answer = answerBlocks.map(block => block.content).join('');
        setLastAnswer(answer);
        const isAnswerCorrect = answer === expectedQuery;
        setIsCorrect(isAnswerCorrect);
        setOpenDialog(true);

        if (!isAnswerCorrect) {
            onLifeLost();
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        onSubmit(lastAnswer);
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Box sx={{mb: 4}}>
                <Typography
                    variant="h6"
                    sx={{
                        mb: 2,
                        color: '#333333',
                        fontWeight: 'bold'
                    }}
                >
                    Zone de construction
                </Typography>

                <Droppable droppableId="answer" direction="horizontal">
                    {(provided) => (
                        <QueryBox
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            {answerBlocks.map((block, index) => (
                                <Fade in key={block.id} timeout={300}>
                                    <div>
                                        <Draggable
                                            draggableId={block.id}
                                            index={index}
                                        >
                                            {(provided, snapshot) => (
                                                <div
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
                                                </div>
                                            )}
                                        </Draggable>
                                    </div>
                                </Fade>
                            ))}
                            {provided.placeholder}
                        </QueryBox>
                    )}
                </Droppable>

                <Box sx={{display: 'flex', justifyContent: 'center', mt: 2}}>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={answerBlocks.length === 0}
                        sx={{
                            minWidth: '200px',
                            fontSize: '1.1rem'
                        }}
                    >
                        Vérifier
                    </Button>
                </Box>

                <Typography
                    variant="h6"
                    sx={{
                        mt: 4,
                        mb: 2,
                        color: '#333333',
                        fontWeight: 'bold'
                    }}
                >
                    Blocs disponibles
                </Typography>

                <Droppable droppableId="blocks" direction="horizontal">
                    {(provided) => (
                        <BlocksContainer
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '12px',
                                alignItems: 'center'
                            }}
                        >
                            {blocks.map((block, index) => (
                                <Draggable
                                    key={block.id}
                                    draggableId={block.id}
                                    index={index}
                                >
                                    {(provided, snapshot) => (
                                        <div
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
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </BlocksContainer>
                    )}
                </Droppable>
            </Box>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle sx={{color: isCorrect ? '#4caf50' : '#f44336'}}>
                    {isCorrect ? 'Bravo !' : 'Essaie encore !'}
                </DialogTitle>
                <DialogContent>
                    {!isCorrect && (
                        <>
                            <Typography variant="body1" sx={{mb: 2}}>
                                Votre réponse:
                            </Typography>
                            <CodeBox>
                                <code>{lastAnswer}</code>
                            </CodeBox>
                            <Typography variant="body1" sx={{mb: 1}}>
                                Réponse attendue:
                            </Typography>
                            <CodeBox>
                                <code>{expectedQuery}</code>
                            </CodeBox>
                        </>
                    )}
                    {isCorrect && (
                        <Typography variant="body1">
                            Votre réponse est correcte !
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={handleCloseDialog}
                        sx={{minWidth: 'auto'}}
                    >
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </DragDropContext>
    );
};

export default DraggableQueryBuilder;