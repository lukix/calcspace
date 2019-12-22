import { reducer, actions } from '../noteCardState';

describe('noteCardState reducer', () => {
  it('should update state after update action', () => {
    // given
    const initialState = {
      expressions: [{ value: '1', result: 1, error: null }],
    };
    const { updateExpression } = actions;
    const index = 0;
    const newValue = '5';
    const updateAction = updateExpression(index, newValue);

    // when
    const newState = reducer(initialState, updateAction);

    // then
    expect(newState).toEqual({
      expressions: [{ value: '5', result: 5, error: null, showResult: false }],
    });
  });
});
