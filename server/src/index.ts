import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { MongoClient } from 'mongodb';

import createRouterFromRouteObjects from './shared/createRouterFromRouteObjects';
import nestRoutes from './shared/nestRoutes';

import usersRoutes from './routes/usersRoutes';

const app = express();
const PORT = 3001;
const CONNECTION_STRING = 'mongodb://mongo:27017';
const DB_NAME = 'math-notes';

app.use(cors());
app.use(bodyParser.json());

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

  const rootRouter = createRouterFromRouteObjects(
    nestRoutes('/api', [
      testRoute,
      ...nestRoutes('/users', usersRoutes({ db })),
      // HERE ADD NEXT ROUTES
    ])
  );

  app.use(rootRouter);

  app.listen(PORT, () => console.log(`Listening on port ${PORT}!`));

  process.on('SIGINT', function() {
    client.close(() => {
      console.log('Mongoose disconnected on app termination');
      process.exit(0);
    });
  });
})();
