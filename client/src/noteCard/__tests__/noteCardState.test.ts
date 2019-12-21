import { reducer, actions } from '../noteCardState';

describe('noteCardState reducer', () => {
  it('should add empty expression when the last expression in not empty anymore', () => {
    // given
    const initialState = {
      expressions: [{ value: '', result: null, error: null }],
    };
    const { updateExpression } = actions;
    const index = 0;
    const newValue = '5';
    const updateAction = updateExpression(index, newValue);

    // when
    const newState = reducer(initialState, updateAction);

    // then
    expect(newState).toEqual({
      expressions: [
        { value: '5', result: 5, error: null, showResult: false },
        { value: '', result: null, error: null, showResult: false },
      ],
    });
  });

  it('should trim empty expression from the end of the list', () => {
    // given
    const initialState = {
      expressions: [
        { value: '', result: null, error: null },
        { value: '1', result: 1, error: null },
        { value: '', result: null, error: null },
        { value: '2', result: null, error: null }, // Expression the will be changed to empty
        { value: '', result: null, error: null },
      ],
    };
    const { updateExpression } = actions;
    const index = 3;
    const newValue = '';
    const updateAction = updateExpression(index, newValue);

    // when
    const newState = reducer(initialState, updateAction);

    // then
    expect(newState.expressions.length).toEqual(3);
  });

  it('should update state after update action', () => {
    // given
    const initialState = {
      expressions: [
        { value: '1', result: 1, error: null },
        { value: '', result: null, error: null },
      ],
    };
    const { updateExpression } = actions;
    const index = 0;
    const newValue = '5';
    const updateAction = updateExpression(index, newValue);

    // when
    const newState = reducer(initialState, updateAction);

    // then
    expect(newState).toEqual({
      expressions: [
        { value: '5', result: 5, error: null, showResult: false },
        { value: '', result: null, error: null, showResult: false },
      ],
    });
  });
});
