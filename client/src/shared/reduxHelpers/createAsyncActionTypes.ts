const createAsyncActionTypes = (actionTypePrefix: string) => ({
  START: `${actionTypePrefix}_START`,
  FAILURE: `${actionTypePrefix}_FAILURE`,
  SUCCESS: `${actionTypePrefix}_SUCCESS`,
});

export default createAsyncActionTypes;
