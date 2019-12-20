import { pipe, dropLastWhile } from 'ramda';
import { createReducer } from '../shared/reduxHelpers';
import evaluateExpressionsList from './evaluateExpressionsList';

const ACTION_TYPES = {
  ADD_EXPRESSION: 'ADD_EXPRESSION',
  UPDATE_EXPRESSION: 'UPDATE_EXPRESSION',
  DELETE_EXPRESSION: 'DELETE_EXPRESSION',
  BACKSPACE_DELETE: 'BACKSPACE_DELETE',
  ENTER_ADD: 'ENTER_ADD',
};

const emptyExpression = {
  value: '',
  result: null,
  error: null,
  showResult: false,
};

export const getInitialState = initialList => ({
  expressions: initialList,
});

const expressionsReducer = createReducer({
  actionHandlers: {
    [ACTION_TYPES.ADD_EXPRESSION]: state => [...state, emptyExpression],
    [ACTION_TYPES.UPDATE_EXPRESSION]: (state, { index, newValue }) =>
      state.map((expression, i) =>
        i === index ? { ...expression, value: newValue } : expression
      ),
    [ACTION_TYPES.DELETE_EXPRESSION]: (state, { index }) =>
      state.filter((expression, i) => i !== index),
    [ACTION_TYPES.BACKSPACE_DELETE]: (state, { index, text }) =>
      state
        .map((expression, i) =>
          i === index - 1
            ? { ...expression, value: `${expression.value}${text}` }
            : expression
        )
        .filter((expression, i) => i !== index),
    [ACTION_TYPES.ENTER_ADD]: (state, { index, textLeft, textRight }) => [
      ...state.slice(0, index),
      { ...state[index], value: textLeft },
      { ...emptyExpression, value: textRight },
      ...state.slice(index + 1),
    ],
  },
});

const isExpressionEmpty = expression => expression.value === '';

const trimEmptyExpressions = dropLastWhile(isExpressionEmpty);

const addEmptyExpression = expressions => {
  const lastExpression = expressions[expressions.length - 1];
  return lastExpression && isExpressionEmpty(lastExpression)
    ? expressions
    : [...expressions, emptyExpression];
};

export const reducer = (state, action) => ({
  ...state,
  expressions: pipe(
    expressionsReducer,
    evaluateExpressionsList,
    trimEmptyExpressions,
    addEmptyExpression
  )(state.expressions, action),
});

export const actions = {
  addNewExpression: () => ({ type: ACTION_TYPES.ADD_EXPRESSION }),
  updateExpression: (index, newValue) => ({
    type: ACTION_TYPES.UPDATE_EXPRESSION,
    payload: { index, newValue },
  }),
  deleteExpression: index => ({
    type: ACTION_TYPES.DELETE_EXPRESSION,
    payload: { index },
  }),
  backspaceDeleteExpression: (index, text) => ({
    type: ACTION_TYPES.BACKSPACE_DELETE,
    payload: { index, text },
  }),
  enterAddExpression: (index, textLeft, textRight) => ({
    type: ACTION_TYPES.ENTER_ADD,
    payload: { index, textLeft, textRight },
  }),
};
