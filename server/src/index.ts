import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { Client } from 'pg';

import {
  createRouterFromRouteObjects,
  nestRoutes,
  applyMiddlewares,
} from './shared/express-helpers';

import usersRoutes from './routes/usersRoutes';
import filesRoutes from './routes/filesRoutes';
import authorizationMiddleware from './auth/authorizationMiddleware';
import setupDatabase from './setupDatabase';
import { DATABASE_URL, PORT, CLIENT_URL } from './config';
import userSettingsRoutes from './routes/userSettingsRoutes';

(async () => {
  await setupDatabase();

  const app = express();
  app.disable('x-powered-by');

  app.use(cors({ credentials: true, origin: CLIENT_URL }));
  app.use(bodyParser.json());
  app.use(cookieParser());

  const dbClient = new Client({
    connectionString: DATABASE_URL,
  });

  try {
    await dbClient.connect();
  } catch (err) {
    console.log('ERROR WHILE CONNECTING TO THE DB');
    throw err;
  }

  console.log('Connected successfully to the DB server');

  const testRoute = {
    path: '/',
    method: 'get',
    handler: () => ({ response: 'Hello World!' }),
  };

  const routesDefinitions = nestRoutes('/api', [
    testRoute,
    ...nestRoutes('/users', usersRoutes({ dbClient })),
    ...applyMiddlewares(
      [authorizationMiddleware],
      [
        ...nestRoutes('/user-settings', userSettingsRoutes({ dbClient })),
        ...nestRoutes('/files', filesRoutes({ dbClient })),
      ]
    ),
  ]);

  const rootRouter = createRouterFromRouteObjects(routesDefinitions);

  console.log(routesDefinitions.map(({ path, method }) => `${path} (${method})`));

  app.use(rootRouter);

  app.listen(PORT, () => console.log(`Listening on port ${PORT}!`));

  process.on('SIGINT', async () => {
    dbClient.end();
    console.log('DB disconnected on app termination');
    process.exit(0);
  });
})();
