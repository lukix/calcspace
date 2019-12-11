const optionalKey = (key, value) => (key ? { [key]: value } : {});

interface CreateAsyncActionHandlersParams {
  types: {
    START: string;
    FAILURE: string;
    SUCCESS: string;
  };
  payloadKey?: string;
  pendingKey?: string;
  errorKey?: string;
}
type CreateAsyncActionHandlers = (
  params: CreateAsyncActionHandlersParams
) => { [key: string]: (state: any, payload?: any) => any };

const createAsyncActionHandlers: CreateAsyncActionHandlers = ({
  types,
  payloadKey,
  pendingKey,
  errorKey,
}) => ({
  [types.START]: state => ({
    ...state,
    ...optionalKey(pendingKey, true),
    ...optionalKey(errorKey, false),
  }),
  [types.FAILURE]: state => ({
    ...state,
    ...optionalKey(pendingKey, false),
    ...optionalKey(errorKey, true),
  }),
  [types.SUCCESS]: (state, payload) => ({
    ...state,
    ...optionalKey(pendingKey, false),
    ...optionalKey(payloadKey, payload),
  }),
});

export default createAsyncActionHandlers;
