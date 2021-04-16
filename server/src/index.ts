import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { Client } from 'pg';
import { Server as SocketServer } from 'socket.io';

import {
  createRouterFromRouteObjects,
  nestRoutes,
  applyMiddlewares,
} from './shared/express-helpers';

import usersRoutes from './routes/usersRoutes';
import filesRoutes from './routes/filesRoutes';
import sharedFilesRoutes from './routes/sharedFilesRoutes';
import createAuthorizationMiddleware from './auth/authorizationMiddleware';
import setupDatabase from './setupDatabase';
import {
  DATABASE_URL,
  PORT,
  ORIGIN_URL,
  ORIGIN_REGEXP_PREFIX,
  SSL_DB_CONNECTION_OPTIONS,
} from './config';
import userSettingsRoutes from './routes/userSettingsRoutes';
import SharedFilesManager from './sharedFilesManager';

console.log('Starting application');

(async () => {
  try {
    console.log('Setting up the DB...');
    try {
      await setupDatabase();
      console.log('DB setup completed.');
    } catch (error) {
      console.error(error);
      console.log('DB setup failed. Proceeding without setup...');
    }

    const app = express();
    app.disable('x-powered-by');

    const corsOptions = {
      credentials: true,
      origin: ORIGIN_URL.startsWith(ORIGIN_REGEXP_PREFIX)
        ? new RegExp(ORIGIN_URL.slice(ORIGIN_REGEXP_PREFIX.length))
        : ORIGIN_URL,
    };
    app.use(cors(corsOptions));
    app.use(bodyParser.json());
    app.use(cookieParser());

    const dbClient = new Client({
      connectionString: DATABASE_URL,
      ...SSL_DB_CONNECTION_OPTIONS,
    });

    try {
      await dbClient.connect();
    } catch (err) {
      console.log('ERROR WHILE CONNECTING TO THE DB');
      throw err;
    }

    console.log('Connected successfully to the DB server');

    const http = app.listen(PORT, () => console.log(`Listening on port ${PORT}!`));
    const io = new SocketServer(http, { cors: corsOptions });
    const sharedFilesManager = SharedFilesManager({ io });

    const testRoute = {
      path: '/',
      method: 'get',
      handler: () => ({ response: 'Hello World!' }),
    };

    const routesDefinitions = nestRoutes('/api', [
      testRoute,
      ...nestRoutes('/users', usersRoutes({ dbClient })),
      ...nestRoutes('/shared-files', sharedFilesRoutes({ dbClient, sharedFilesManager })),
      ...applyMiddlewares(
        [createAuthorizationMiddleware()],
        [
          ...nestRoutes('/user-settings', userSettingsRoutes({ dbClient })),
          ...nestRoutes('/files', filesRoutes({ dbClient, sharedFilesManager })),
        ]
      ),
    ]);

    const rootRouter = createRouterFromRouteObjects(routesDefinitions);

    console.log(routesDefinitions.map(({ path, method }) => `${path} (${method})`));

    app.use(rootRouter);

    process.on('SIGINT', async () => {
      dbClient.end();
      console.log('DB disconnected on app termination');
      process.exit(0);
    });
  } catch (error) {
    console.log('Application has crashed.');
    console.error(error);
  }
})();
