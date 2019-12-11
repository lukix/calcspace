import { Router } from 'express';
import mapHandlerToRoute from './mapHandlerToRoute';

const createRouterFromRouteObjects = routeObjects => {
  const router = Router();
  routeObjects.forEach(({ path, method, handler }) => {
    router[method](path, mapHandlerToRoute(handler));
  });
  return router;
};

export default createRouterFromRouteObjects;
