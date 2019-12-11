import express from 'express';
import cors from 'cors';

import createRouterFromRouteObjects from './shared/createRouterFromRouteObjects';
import nestRoutes from './shared/nestRoutes';

import shopsRoutes from './routes/shopsRoutes';

const app = express();
const PORT = 3001;

app.use(cors());

const testRoute = {
  path: '/',
  method: 'get',
  handler: () => ({ response: 'Hello World!' }),
};

const rootRouter = createRouterFromRouteObjects(
  nestRoutes('/api', [
    testRoute,
    ...nestRoutes('/shops', shopsRoutes),
    // HERE ADD NEXT ROUTES
  ])
);

app.use(rootRouter);

app.listen(PORT, () => console.log(`Listening on port ${PORT}!`));
