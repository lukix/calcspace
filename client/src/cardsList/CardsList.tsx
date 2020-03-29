import React, { useState } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import DraggableCard from './DraggableCard';

interface CardsListProps {
  cards: Array<{ id: string; code: string; evaluatedCode: string }>;
  getCardActions: Function;
  reorderCards: Function;
}

const CardsList: React.FC<CardsListProps> = ({
  cards,
  getCardActions,
  reorderCards,
}) => {
  const [selectedCardId, setSelectedCardId] = useState(null);

  const onDragEnd = ({ source, destination }) => {
    if (!destination) {
      return;
    }

    reorderCards(source.index, destination.index);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {provided => (
          <div ref={provided.innerRef}>
            {cards.map(({ id, code, evaluatedCode }, index) => (
              <DraggableCard
                key={id}
                id={id}
                index={index}
                code={code}
                evaluatedCode={evaluatedCode}
                getCardActions={getCardActions}
                selectCardId={setSelectedCardId}
                isActive={id === selectedCardId}
                isSomeCardActive={selectedCardId !== null}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default CardsList;
