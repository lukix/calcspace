import { createReducer } from '../shared/reduxHelpers';

const ACTION_TYPES = {
  UPDATE_CODE: 'UPDATE_CODE',
  ADD_CARD: 'ADD_CARD',
  DELETE_CARD: 'DELETE_CARD',
  REORDER_CARDS: 'REORDER_CARDS',
};

const createEmptyCard = generateId => ({
  id: generateId(),
  code: '',
  name: 'New file',
});

export const getInitialState = generateId => ({
  cards: [createEmptyCard(generateId)],
});

const setCardCode = (state, cardId, value) => ({
  ...state,
  cards: state.cards.map(card =>
    card.id === cardId ? { ...card, code: value } : card
  ),
});

export const getReducer = generateId =>
  createReducer({
    actionHandlers: {
      [ACTION_TYPES.UPDATE_CODE]: (state, { newValue, cardId }) =>
        setCardCode(state, cardId, newValue),
      [ACTION_TYPES.ADD_CARD]: state => ({
        ...state,
        cards: [createEmptyCard(generateId), ...state.cards],
      }),
      [ACTION_TYPES.DELETE_CARD]: (state, { cardId }) => ({
        ...state,
        cards: state.cards.filter(card => card.id !== cardId),
      }),
    },
  });

export const actions = {
  addCard: () => ({ type: ACTION_TYPES.ADD_CARD }),
  updateCode: ({ code, id }) => ({
    type: ACTION_TYPES.UPDATE_CODE,
    payload: { newValue: code, cardId: id },
  }),
  deleteCard: ({ id }) => ({
    type: ACTION_TYPES.DELETE_CARD,
    payload: { cardId: id },
  }),
};
