import { reducer, getActions } from '../noteCardState';

const dispatch = x => x;

describe('noteCardState reducer', () => {
  it('should update state after update action', () => {
    // given
    const initialState = {
      expressions: [{ value: '', result: null, error: null }],
    };
    const { updateExpression } = getActions(dispatch);
    const index = 0;
    const newValue = '5';
    const updateAction = updateExpression(index, newValue);

    // when
    const newState = reducer(initialState, updateAction);

    // then
    expect(newState).toEqual({
      expressions: [{ value: '5', result: 5, error: null }],
    });
  });

  it('should update state setting correct results', () => {
    // given
    const initialState = {
      expressions: [
        { value: 'x = 5', result: null, error: null },
        { value: 'y = x * 2', result: null, error: null },
      ],
    };
    const { addNewExpression } = getActions(dispatch);
    const addAction = addNewExpression();

    // when
    const newState = reducer(initialState, addAction);

    // then
    expect(newState.expressions[0]).toEqual({
      value: 'x = 5',
      result: 5,
      error: null,
    });
    expect(newState.expressions[1]).toEqual({
      value: 'y = x * 2',
      result: 10,
      error: null,
    });
  });
});
