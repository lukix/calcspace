const createDispatchBinder = (actionCreators: {
  [key: string]: Function;
}) => dispatch =>
  Object.entries(actionCreators).reduce(
    (acc: { [key: string]: Function }, [actionKeyName, actionCreator]) => ({
      ...acc,
      [actionKeyName]: (...args) => dispatch(actionCreator(...args)),
    }),
    {}
  );

export default createDispatchBinder;
