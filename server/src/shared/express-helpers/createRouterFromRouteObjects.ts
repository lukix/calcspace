import { Router } from 'express';
import mapRouteObjectToRoute from './mapRouteObjectToRoute';

const createRouterFromRouteObjects = (routeObjects) => {
  const router = Router();
  routeObjects.forEach((routeObject) => {
    router[routeObject.method](
      routeObject.path,
      ...(routeObject.middlewares || []),
      mapRouteObjectToRoute(routeObject)
    );
  });
  return router;
};

export default createRouterFromRouteObjects;
