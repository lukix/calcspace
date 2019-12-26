import uuid from 'uuid/v4';
import { createReducer } from '../shared/reduxHelpers';
import evaluateExpressionsList from './evaluateExpressionsList';

const ACTION_TYPES = {
  UPDATE_EXPRESSION: 'UPDATE_EXPRESSION',
  BACKSPACE_DELETE_EXPRESSION: 'BACKSPACE_DELETE',
  ENTER_ADD_EXPRESSION: 'ENTER_ADD_EXPRESSION',
  ADD_CARD: 'ADD_CARD',
  DELETE_CARD: 'DELETE_CARD',
  SET_CARDS: 'SET_CARDS',
};

const createEmptyExpression = generateId => ({
  id: generateId(),
  value: '',
  result: null,
  error: null,
  showResult: false,
});

const createEmptyCard = generateId => ({
  id: uuid(),
  expressions: [{ ...createEmptyExpression(generateId) }],
});

export const getInitialState = generateId => ({
  cards: [createEmptyCard(generateId)],
});

const getCardExpressions = (state, cardId) =>
  state.cards.find(({ id }) => id === cardId).expressions;
const setCardExpressions = (state, cardId, value) => ({
  ...state,
  cards: state.cards.map(card =>
    card.id === cardId
      ? { ...card, expressions: evaluateExpressionsList(value) }
      : card
  ),
});

export const getReducer = generateId =>
  createReducer({
    actionHandlers: {
      [ACTION_TYPES.UPDATE_EXPRESSION]: (state, { index, newValue, cardId }) =>
        setCardExpressions(
          state,
          cardId,
          getCardExpressions(state, cardId).map((expression, i) =>
            i === index ? { ...expression, value: newValue } : expression
          )
        ),
      [ACTION_TYPES.BACKSPACE_DELETE_EXPRESSION]: (
        state,
        { index, text, cardId }
      ) =>
        setCardExpressions(
          state,
          cardId,
          getCardExpressions(state, cardId)
            .map((expression, i) =>
              i === index - 1
                ? { ...expression, value: `${expression.value}${text}` }
                : expression
            )
            .filter((expression, i) => i !== index)
        ),
      [ACTION_TYPES.ENTER_ADD_EXPRESSION]: (
        state,
        { index, textLeft, textRight, cardId }
      ) => {
        const expressions = getCardExpressions(state, cardId);
        return setCardExpressions(state, cardId, [
          ...expressions.slice(0, index),
          { ...expressions[index], value: textLeft },
          { ...createEmptyExpression(generateId), value: textRight },
          ...expressions.slice(index + 1),
        ]);
      },
      [ACTION_TYPES.ADD_CARD]: state => ({
        ...state,
        cards: [createEmptyCard(generateId), ...state.cards],
      }),
      [ACTION_TYPES.DELETE_CARD]: (state, { cardId }) => ({
        ...state,
        cards: state.cards.filter(card => card.id !== cardId),
      }),
      [ACTION_TYPES.SET_CARDS]: (state, { cards }) => ({
        ...state,
        cards,
      }),
    },
  });

export const getCardActions = cardId => ({
  updateExpression: (index, newValue) => ({
    type: ACTION_TYPES.UPDATE_EXPRESSION,
    payload: { index, newValue, cardId },
  }),
  backspaceDeleteExpression: (index, text) => ({
    type: ACTION_TYPES.BACKSPACE_DELETE_EXPRESSION,
    payload: { index, text, cardId },
  }),
  enterAddExpression: (index, textLeft, textRight) => ({
    type: ACTION_TYPES.ENTER_ADD_EXPRESSION,
    payload: { index, textLeft, textRight, cardId },
  }),
  deleteCard: () => ({ type: ACTION_TYPES.DELETE_CARD, payload: { cardId } }),
});

export const actions = {
  addCard: () => ({ type: ACTION_TYPES.ADD_CARD }),
  setCards: cards => ({ type: ACTION_TYPES.SET_CARDS, payload: { cards } }),
};
