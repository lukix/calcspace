type ActionHandler = (state: any, payload: any) => any;

const defaultActionHandler: ActionHandler = state => state;

const createReducer = ({
  initialState,
  actionHandlers,
}: {
  initialState?: any;
  actionHandlers: { [key: string]: ActionHandler };
}) => {
  const reducer = (
    state = initialState,
    action: { type: string; payload?: any }
  ) => {
    const { type, payload } = action;
    const actionHandler = actionHandlers[type] || defaultActionHandler;
    return actionHandler(state, payload);
  };
  return reducer;
};

export default createReducer;
