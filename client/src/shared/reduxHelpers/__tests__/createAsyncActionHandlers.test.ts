import { createAsyncActionHandlers } from '..';

const types = {
  START: 'START',
  FAILURE: 'FAILURE',
  SUCCESS: 'SUCCESS',
};
const payloadKey = 'payload';
const pendingKey = 'pending';
const errorKey = 'error';

describe('createAsyncActionHandlers', () => {
  it('should create handlers which return correct state', () => {
    const handlers = createAsyncActionHandlers({
      types,
      payloadKey,
      pendingKey,
      errorKey,
    });
    const initialState = {};
    const startHandler = handlers[types.START];
    const failureHandler = handlers[types.FAILURE];
    const successHandler = handlers[types.SUCCESS];

    expect(startHandler(initialState)).toEqual({
      pending: true,
      error: false,
    });
    expect(failureHandler(initialState)).toEqual({
      pending: false,
      error: true,
    });
    expect(successHandler(initialState, 'payload')).toEqual({
      pending: false,
      payload: 'payload',
    });
  });
});
