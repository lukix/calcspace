import React, { useState } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import DraggableCard from './DraggableCard';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

interface CardsListProps {
  cards: Array<{ id: string; expressions: Array<any> }>;
  getCardActions: Function;
  setCards: Function;
}

const CardsList: React.FC<CardsListProps> = ({
  cards,
  getCardActions,
  setCards,
}) => {
  const [selectedCardId, setSelectedCardId] = useState(null);

  const onDragEnd = ({ source, destination }) => {
    if (!destination) {
      return;
    }

    const reorderedCards = reorder(cards, source.index, destination.index);
    setCards(reorderedCards);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {provided => (
          <div ref={provided.innerRef}>
            {cards.map(({ id, expressions }, index) => (
              <DraggableCard
                key={id}
                id={id}
                index={index}
                expressions={expressions}
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
