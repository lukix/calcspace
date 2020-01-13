import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { MongoClient } from 'mongodb';

import createRouterFromRouteObjects from './shared/createRouterFromRouteObjects';
import nestRoutes from './shared/nestRoutes';
import applyMiddlewares from './shared/applyMiddlewares';

import usersRoutes from './routes/usersRoutes';
import cardsRoutes from './routes/cardsRoutes';
import authorizationMiddleware from './auth/authorizationMiddleware';
import { DB_NAME, CONNECTION_STRING, PORT, CLIENT_URL } from './config';

const app = express();

app.use(cors({ credentials: true, origin: CLIENT_URL }));
app.use(bodyParser.json());
app.use(cookieParser({ sameSite: true }));

(async () => {
  const client = await MongoClient.connect(CONNECTION_STRING, {
    useUnifiedTopology: true,
  }).catch(err => {
    console.log('ERROR WHILE CONNECTING TO THE DB');
    throw err;
  });

  console.log('Connected successfully to the DB server');

  const db = client.db(DB_NAME);

  const testRoute = {
    path: '/',
    method: 'get',
    handler: () => ({ response: 'Hello World!' }),
  };

  const routesDefinitions = nestRoutes('/api', [
    testRoute,
    ...nestRoutes('/users', usersRoutes({ db })),
    ...applyMiddlewares(
      [authorizationMiddleware],
      nestRoutes('/cards', cardsRoutes({ db }))
    ),
  ]);

  const rootRouter = createRouterFromRouteObjects(routesDefinitions);

  console.log(routesDefinitions.map(({ path }) => path));

  app.use(rootRouter);

  app.listen(PORT, () => console.log(`Listening on port ${PORT}!`));

  process.on('SIGINT', function() {
    client.close(() => {
      console.log('Mongoose disconnected on app termination');
      process.exit(0);
    });
  });
})();
