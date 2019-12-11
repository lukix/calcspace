import { createReducer } from '..';

const TEST_ACTION_TYPE = 'TEST_ACTION_TYPE';
const UNHANDLED_ACTION_TYPE = 'UNHANDLED_ACTION_TYPE';
const initialState = { key1: 'value1' };

describe('createReducer', () => {
  it('should set initialState when passed state is undefined', () => {
    // given
    const actionHandlers = {};
    const reducer = createReducer({
      initialState,
      actionHandlers,
    });
    const action = { type: TEST_ACTION_TYPE };

    // when
    const nextState = reducer(undefined, action);

    // then
    expect(nextState).toEqual(initialState);
  });

  it('should return unchanged state when the action is not specified in actionHandlers', () => {
    // given
    const actionHandlers = {};
    const reducer = createReducer({
      initialState,
      actionHandlers,
    });
    const action = { type: UNHANDLED_ACTION_TYPE };
    const prevState = { key2: 'value2' };

    // when
    const nextState = reducer(prevState, action);

    // then
    expect(nextState).toEqual(prevState);
  });

  it('should use action handler to return a new state', () => {
    // given
    const actionHandlers = {
      [TEST_ACTION_TYPE]: (state, payload) => ({ ...state, payload }),
    };
    const reducer = createReducer({
      initialState,
      actionHandlers,
    });
    const payload = 'test payload';
    const action = { type: TEST_ACTION_TYPE, payload };
    const prevState = { key2: 'value2' };
    const expectedNewState = { key2: 'value2', payload };

    // when
    const nextState = reducer(prevState, action);

    // then
    expect(nextState).toEqual(expectedNewState);
  });
});
