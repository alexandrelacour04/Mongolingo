
import { Chip } from '@mui/material';
import { Draggable } from "@hello-pangea/dnd";

const Block = ({ block, index, onDoubleClick }) => (
    <Draggable draggableId={block.id} index={index}>
        {(provided) => (
            <Chip
                label={block.content}
                sx={{ margin: 1, cursor: 'move' }}
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                onDoubleClick={() => onDoubleClick && onDoubleClick(block)}
            />
        )}
    </Draggable>
);

export default Block;