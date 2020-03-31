import React from 'react';
import NoteCard from '../noteCard/NoteCard';

interface CardsListProps {
  cards: Array<{ id: string; code: string }>;
  getCardActions: Function;
}

const CardsList: React.FC<CardsListProps> = ({ cards, getCardActions }) => {
  return (
    <div>
      {cards.map(({ id, code }) => {
        const { updateCode, deleteCard } = getCardActions(id);

        return (
          <NoteCard
            key={id}
            updateCode={updateCode}
            deleteCard={deleteCard}
            code={code}
          />
        );
      })}
    </div>
  );
};

export default CardsList;
