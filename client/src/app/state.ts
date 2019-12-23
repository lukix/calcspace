import { createReducer } from '../shared/reduxHelpers';
import evaluateExpressionsList from './evaluateExpressionsList';

const ACTION_TYPES = {
  UPDATE_EXPRESSION: 'UPDATE_EXPRESSION',
  BACKSPACE_DELETE_EXPRESSION: 'BACKSPACE_DELETE',
  ENTER_ADD_EXPRESSION: 'ENTER_ADD_EXPRESSION',
  ADD_CARD: 'ADD_CARD',
};

const getRandomId = () => `${Math.round(Math.random() * 1e8)}`;

const emptyExpression = {
  value: '',
  result: null,
  error: null,
  showResult: false,
};

const createEmptyCard = () => ({
  id: getRandomId(),
  expressions: [{ ...emptyExpression }],
});

export const getInitialState = () => ({
  cards: [createEmptyCard()],
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

export const reducer = createReducer({
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
        { ...emptyExpression, value: textRight },
        ...expressions.slice(index + 1),
      ]);
    },
    [ACTION_TYPES.ADD_CARD]: state => ({
      ...state,
      cards: [createEmptyCard(), ...state.cards],
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
});

export const actions = {
  addCard: () => ({ type: ACTION_TYPES.ADD_CARD }),
};
