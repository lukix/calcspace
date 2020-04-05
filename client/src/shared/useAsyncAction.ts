import { useReducer, useCallback } from 'react';
import {
  createReducer,
  createAsyncActionTypes,
  createAsyncActionHandlers,
} from './reduxHelpers';

const actionTypes = createAsyncActionTypes('ASYNC_ACTION');

const initialState = {
  result: null,
  isPending: false,
  hasFailed: false,
};

const reducer = createReducer({
  actionHandlers: {
    ...createAsyncActionHandlers({
      types: actionTypes,
      payloadKey: 'result',
      pendingKey: 'isPending',
      errorKey: 'hasFailed',
    }),
  },
});

const useAsyncAction = asyncAction => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const execute = useCallback(
    async (...props) => {
      dispatch({ type: actionTypes.START });
      try {
        const result = await asyncAction(...props);
        dispatch({ type: actionTypes.SUCCESS, payload: result });
      } catch {
        dispatch({ type: actionTypes.FAILURE });
      }
    },
    [asyncAction]
  );

  return [execute, state.result, state.isPending, state.hasFailed];
};

export default useAsyncAction;
