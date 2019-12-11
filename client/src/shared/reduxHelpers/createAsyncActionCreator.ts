interface CreateAsyncActionCreator {
  actionTypes: {
    START: string;
    FAILURE: string;
    SUCCESS: string;
  };
  action: Function;
}

const createAsyncActionCreator = ({
  actionTypes,
  action,
}: CreateAsyncActionCreator) => {
  const apiActionCreator = (...props) => async dispatch => {
    dispatch({ type: actionTypes.START });
    try {
      const result = await action(...props);
      dispatch({ type: actionTypes.SUCCESS, payload: result });
    } catch {
      dispatch({ type: actionTypes.FAILURE });
    }
  };
  return apiActionCreator;
};

export default createAsyncActionCreator;
