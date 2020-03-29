import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import OutsideClickHandler from 'react-outside-click-handler';
import NoteCard from '../noteCard/NoteCard';
import styles from './DraggableCard.module.scss';

interface DraggableCardProps {
  id: string;
  code: string;
  evaluatedCode: string;
  index: number;
  getCardActions: Function;
  selectCardId: Function;
  isActive: boolean;
  isSomeCardActive: boolean;
}

const DraggableCard: React.FC<DraggableCardProps> = ({
  id,
  code,
  evaluatedCode,
  index,
  getCardActions,
  selectCardId,
  isActive,
  isSomeCardActive,
}) => {
  const { updateCode, deleteCard } = getCardActions(id);

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
              code={code}
              evaluatedCode={evaluatedCode}
              updateCode={updateCode}
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
