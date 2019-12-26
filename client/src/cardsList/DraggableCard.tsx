import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import NoteCard from '../noteCard/NoteCard';
import styles from './DraggableCard.module.scss';

interface DraggableCardProps {
  id: string;
  expressions: Array<any>;
  index: number;
  getCardActions: Function;
}

const DraggableCard: React.FC<DraggableCardProps> = ({
  id,
  expressions,
  index,
  getCardActions,
}) => {
  const {
    updateExpression,
    backspaceDeleteExpression,
    enterAddExpression,
    deleteCard,
  } = getCardActions(id);

  return (
    <Draggable draggableId={id} index={index}>
      {provided => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={styles.draggableCard}
        >
          <NoteCard
            expressions={expressions}
            updateExpression={updateExpression}
            backspaceDeleteExpression={backspaceDeleteExpression}
            enterAddExpression={enterAddExpression}
            deleteCard={deleteCard}
          />
        </div>
      )}
    </Draggable>
  );
};

export default DraggableCard;
