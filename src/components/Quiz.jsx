// src/components/Quiz.jsx
import React from 'react';
import { Paper, Typography } from '@mui/material';
import DraggableQueryBuilder from './DraggableQueryBuilder';

const Quiz = ({ question, onAnswerSubmit }) => {
    return (
        <Paper className="p-6">
            <Typography variant="h6" className="mb-4">
                {question.question}
            </Typography>

            <DraggableQueryBuilder
                expectedQuery={question.expectedQuery}
                onSubmit={onAnswerSubmit}
            />

            {question.hints && question.hints.length > 0 && (
                <div className="mt-4">
                    <Typography variant="subtitle1" className="font-bold">
                        Indices :
                    </Typography>
                    <ul className="list-disc pl-5">
                        {question.hints.map((hint, index) => (
                            <li key={index}>{hint}</li>
                        ))}
                    </ul>
                </div>
            )}
        </Paper>
    );
};

export default Quiz;