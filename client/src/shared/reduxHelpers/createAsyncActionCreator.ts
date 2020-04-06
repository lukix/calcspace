interface CreateAsyncActionCreator<T extends any[]> {
  actionTypes: {
    START: string;
    FAILURE: string;
    SUCCESS: string;
  };
  action: Function;
  mapStartAction?: (action: object, ...args: T) => object;
  mapSuccessAction?: Function;
  mapFailureAction?: Function;
}

const createAsyncActionCreator = <T extends any[]>({
  actionTypes,
  action,
  mapStartAction = (action, ...args) => action,
  mapSuccessAction = (action, ...args) => action,
  mapFailureAction = (action, ...args) => action,
}: CreateAsyncActionCreator<T>) => {
  const apiActionCreator = (...args: T) => async dispatch => {
    const startAction = { type: actionTypes.START };
    dispatch(mapStartAction(startAction, ...args));
    try {
      const result = await action(...args);
      const successAction = { type: actionTypes.SUCCESS, payload: result };
      dispatch(mapSuccessAction(successAction, ...args));
    } catch {
      const failureAction = { type: actionTypes.FAILURE };
      dispatch(mapFailureAction(failureAction, ...args));
    }
  };
  return apiActionCreator;
};

export default createAsyncActionCreator;
