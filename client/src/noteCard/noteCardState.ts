import { createReducer } from '../shared/reduxHelpers';
import createDispatchBinder from '../shared/createDispatchBinder';
import evaluateExpression from '../mathEngine/evaluateExpression';

export const ACTION_TYPES = {
  ADD_EXPRESSION: 'ADD_EXPRESSION',
  UPDATE_EXPRESSION: 'UPDATE_EXPRESSION',
  DELETE_EXPRESSION: 'DELETE_EXPRESSION',
};

const emptyExpression = { value: '', result: null, error: null };

const evaluateExpressions = expressions => {
  const initial = { values: {}, expressions: [] };
  const { expressions: evaluatedExpressions } = expressions.reduce(
    (acc, expression) => {
      const { result, error, symbol } = evaluateExpression(
        expression.value,
        acc.values
      );
      return {
        values: symbol ? { ...acc.values, [symbol]: result } : acc.values,
        expressions: [...acc.expressions, { ...expression, result, error }],
      };
    },
    initial
  );
  return evaluatedExpressions;
};

export const initialState = {
  expressions: [emptyExpression],
};

const expressionsReducer = createReducer({
  actionHandlers: {
    [ACTION_TYPES.ADD_EXPRESSION]: state => [...state, emptyExpression],
    [ACTION_TYPES.UPDATE_EXPRESSION]: (state, { index, newValue }) =>
      state.map((expression, i) =>
        i === index ? { ...expression, value: newValue } : expression
      ),
    [ACTION_TYPES.DELETE_EXPRESSION]: (state, { index }) =>
      state.filter((expression, i) => i !== index),
  },
});

export const reducer = (state, action) => ({
  ...state,
  expressions: evaluateExpressions(
    expressionsReducer(state.expressions, action)
  ),
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
