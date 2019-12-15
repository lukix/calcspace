import { createReducer } from '../shared/reduxHelpers';
import createDispatchBinder from '../shared/createDispatchBinder';

export const ACTION_TYPES = {
  ADD_EXPRESSION: 'ADD_EXPRESSION',
  UPDATE_EXPRESSION: 'UPDATE_EXPRESSION',
  DELETE_EXPRESSION: 'DELETE_EXPRESSION',
};

export const initialState = {
  expressions: [''],
};

export const reducer = createReducer({
  actionHandlers: {
    [ACTION_TYPES.ADD_EXPRESSION]: state => ({
      ...state,
      expressions: [...state.expressions, ''],
    }),
    [ACTION_TYPES.UPDATE_EXPRESSION]: (state, { index, newValue }) => ({
      ...state,
      expressions: state.expressions.map((expression, i) =>
        i === index ? newValue : expression
      ),
    }),
    [ACTION_TYPES.DELETE_EXPRESSION]: (state, { index }) => ({
      ...state,
      expressions: state.expressions.filter((expression, i) => i !== index),
    }),
  },
});

export const getActions = createDispatchBinder({
  addNewExpression: () => ({ type: ACTION_TYPES.ADD_EXPRESSION }),
  updateExpression: (index, newValue) => ({
    type: ACTION_TYPES.UPDATE_EXPRESSION,
    payload: { index, newValue },
  }),
  deleteExpression: index => ({
    type: ACTION_TYPES.DELETE_EXPRESSION,
    payload: { index },
  }),
});
