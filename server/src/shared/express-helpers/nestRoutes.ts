const nestRoutes = (pathSuffix, routeObjects) =>
  routeObjects.map(routeObject => ({
    ...routeObject,
    path: `${pathSuffix}${routeObject.path}`,
  }));

export default nestRoutes;
