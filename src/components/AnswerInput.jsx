// src/components/AnswerInput.jsx
import React, {useState} from 'react';
import {Chip, TextField, Paper} from '@mui/material';
import {DragDropContext, Droppable, Draggable} from '@hello-pangea/dnd';

const AnswerInput = ({type, options, onAnswerChange, disabled}) => {
    const [answer, setAnswer] = useState('');
    const [droppedItems, setDroppedItems] = useState([]);

    const handleDragEnd = (result) => {
        if (!result.destination || disabled) return;

        const newDroppedItems = Array.from(droppedItems);
        const [reorderedItem] = options.splice(result.source.index, 1);
        newDroppedItems.splice(result.destination.index, 0, reorderedItem);

        setDroppedItems(newDroppedItems);
        onAnswerChange(newDroppedItems.join(' '));
    };

    const handleChipClick = (chip) => {
        if (disabled) return;
        const newAnswer = answer + (answer ? ' ' : '') + chip;
        setAnswer(newAnswer);
        onAnswerChange(newAnswer);
    };

    switch (type) {
        case 'drag-drop':
            return (
                <DragDropContext onDragEnd={handleDragEnd}>
                    <div className="flex flex-col gap-4">
                        <Droppable droppableId="options" direction="horizontal" isDropDisabled={disabled}>
                            {(provided) => (
                                <Paper
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="p-4 flex flex-wrap gap-2"
                                >
                                    {options.map((option, index) => (
                                        <Draggable
                                            key={option}
                                            draggableId={option}
                                            index={index}
                                            isDragDisabled={disabled}
                                        >
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                >
                                                    <Chip label={option} disabled={disabled}/>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </Paper>
                            )}
                        </Droppable>
                        <Paper className="p-4 min-h-[100px] border-2 border-dashed">
                            {droppedItems.map((item, index) => (
                                <Chip key={index} label={item} className="m-1" disabled={disabled}/>
                            ))}
                        </Paper>
                    </div>
                </DragDropContext>
            );

        case 'chips':
            return (
                <div className="flex flex-col gap-4">
                    <Paper className="p-4 flex flex-wrap gap-2">
                        {options.map((option) => (
                            <Chip
                                key={option}
                                label={option}
                                onClick={() => handleChipClick(option)}
                                clickable
                                disabled={disabled}
                            />
                        ))}
                    </Paper>
                    <TextField
                        multiline
                        value={answer}
                        onChange={(e) => {
                            if (!disabled) {
                                setAnswer(e.target.value);
                                onAnswerChange(e.target.value);
                            }
                        }}
                        className="w-full"
                        disabled={disabled}
                    />
                </div>
            );

        case 'fill-blanks':
            return (
                <div className="flex flex-wrap gap-2 items-center">
                    {options.map((part, index) => (
                        typeof part === 'string' ? (
                            <span key={index}>{part}</span>
                        ) : (
                            <TextField
                                key={index}
                                size="small"
                                style={{width: part.length * 10 + 'px'}}
                                onChange={(e) => {
                                    if (!disabled) {
                                        const newAnswers = [...answer.split(' ')];
                                        newAnswers[index] = e.target.value;
                                        const newAnswer = newAnswers.join(' ');
                                        setAnswer(newAnswer);
                                        onAnswerChange(newAnswer);
                                    }
                                }}
                                disabled={disabled}
                            />
                        )
                    ))}
                </div>
            );

        default:
            return (
                <TextField
                    multiline
                    fullWidth
                    value={answer}
                    onChange={(e) => {
                        if (!disabled) {
                            setAnswer(e.target.value);
                            onAnswerChange(e.target.value);
                        }
                    }}
                    disabled={disabled}
                />
            );
    }
};

export default AnswerInput;