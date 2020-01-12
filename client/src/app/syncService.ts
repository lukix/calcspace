import { zip, findIndex, findLastIndex } from 'ramda';

const findReorderIndexes = cardsIdsPairs => {
  const firstIndex = findIndex(([id1, id2]) => id1 !== id2, cardsIdsPairs);
  const lastIndex = findLastIndex(([id1, id2]) => id1 !== id2, cardsIdsPairs);

  return cardsIdsPairs[firstIndex][0] === cardsIdsPairs[lastIndex][1]
    ? { sourceIndex: firstIndex, destinationIndex: lastIndex }
    : { sourceIndex: lastIndex, destinationIndex: firstIndex };
};

const convertCardsListToMap = cardsList =>
  new Map(cardsList.map(card => [card.id, card]));

export const compareStates = (prevCards, newCards) => {
  const prevCardsMap = convertCardsListToMap(prevCards);
  const newCardsMap = convertCardsListToMap(newCards);

  if (newCards.length > prevCards.length) {
    const addedCard = newCards.find(({ id }) => !prevCardsMap.has(id));
    return { type: 'ADD', data: { id: addedCard.id } };
  }

  if (newCards.length < prevCards.length) {
    const deletedCard = prevCards.find(({ id }) => !newCardsMap.has(id));
    return { type: 'DELETE', data: { id: deletedCard.id } };
  }

  const cardsPairs = zip(prevCards, newCards);
  const cardsIdsPairs = cardsPairs.map(([prevCard, newCard]) => [
    prevCard.id,
    newCard.id,
  ]);

  if (
    cardsIdsPairs.some(([prevCardId, newCardId]) => prevCardId !== newCardId)
  ) {
    const { sourceIndex, destinationIndex } = findReorderIndexes(cardsIdsPairs);
    return { type: 'CHANGE_ORDER', data: { sourceIndex, destinationIndex } };
  }

  const [, changedCard] = cardsPairs.find(
    ([prevCard, newCard]) => prevCard !== newCard
  );
  return { type: 'CHANGE', data: changedCard };
};
