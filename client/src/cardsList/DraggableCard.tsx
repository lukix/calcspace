import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import OutsideClickHandler from 'react-outside-click-handler';
import NoteCard from '../noteCard/NoteCard';
import styles from './DraggableCard.module.scss';

interface DraggableCardProps {
  id: string;
  expressions: Array<{
    id: string;
    value: string;
    result?: number;
    error?: { message: string };
    showResult: boolean;
  }>;
  index: number;
  getCardActions: Function;
  selectCardId: Function;
  isActive: boolean;
  isSomeCardActive: boolean;
}

const DraggableCard: React.FC<DraggableCardProps> = ({
  id,
  expressions,
  index,
  getCardActions,
  selectCardId,
  isActive,
  isSomeCardActive,
}) => {
  const {
    updateExpression,
    backspaceDeleteExpression,
    enterAddExpression,
    deleteCard,
  } = getCardActions(id);

  const deleteAndUnselectCard = () => {
    deleteCard();
    selectCardId(null);
  };
  const unselectCards = () => selectCardId(null);

  return (
    <Draggable draggableId={id} index={index} isDragDisabled={isSomeCardActive}>
      {(provided, { isDragging }) => (
        <OutsideClickHandler
          onOutsideClick={unselectCards}
          disabled={!isActive}
        >
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={styles.draggableCard}
          >
            {!isActive && (
              <div
                className={styles.draggableOverlay}
                onClick={() => selectCardId(id)}
              ></div>
            )}

            <NoteCard
              expressions={expressions}
              updateExpression={updateExpression}
              backspaceDeleteExpression={backspaceDeleteExpression}
              enterAddExpression={enterAddExpression}
              deleteCard={deleteAndUnselectCard}
              isActive={isActive}
              isSomeCardActive={isSomeCardActive}
              unselect={unselectCards}
              isDragging={isDragging}
            />
          </div>
        </OutsideClickHandler>
      )}
    </Draggable>
  );
};

export default DraggableCard;
