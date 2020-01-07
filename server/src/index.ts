import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { MongoClient } from 'mongodb';

import createRouterFromRouteObjects from './shared/createRouterFromRouteObjects';
import nestRoutes from './shared/nestRoutes';
import applyMiddlewares from './shared/applyMiddlewares';

import usersRoutes from './routes/usersRoutes';
import protectedRoutes from './routes/protectedRoutes';
import authorizationMiddleware from './auth/authorizationMiddleware';

const app = express();
const PORT = 3001;
const CONNECTION_STRING = 'mongodb://mongo:27017';
const DB_NAME = 'math-notes';

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

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
      nestRoutes('/secrets', protectedRoutes({ db }))
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
