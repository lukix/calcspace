const applyMiddlewares = (
  middlewares: Array<Function>,
  routeObjects: Array<{ middlewares?: Array<Function> }>
) =>
  routeObjects.map(routeObject => ({
    ...routeObject,
    middlewares: [...(routeObject.middlewares || []), ...middlewares],
  }));

export default applyMiddlewares;
