import React from 'react';
import NoteCard from '../noteCard/NoteCard';

interface CardsListProps {
  cards: Array<{ id: string; expressions: Array<any> }>;
  getCardActions: Function;
}

const CardsList: React.FC<CardsListProps> = ({ cards, getCardActions }) => (
  <>
    {cards.map(({ id, expressions }) => {
      const {
        updateExpression,
        backspaceDeleteExpression,
        enterAddExpression,
        deleteCard,
      } = getCardActions(id);

      return (
        <NoteCard
          key={id}
          expressions={expressions}
          updateExpression={updateExpression}
          backspaceDeleteExpression={backspaceDeleteExpression}
          enterAddExpression={enterAddExpression}
          deleteCard={deleteCard}
        />
      );
    })}
  </>
);

export default CardsList;
