import express from 'express';
import bodyParser from 'body-parser';
import AWS from 'aws-sdk';

import { createRouterFromRouteObjects } from './shared/express-helpers';

import {
  PORT,
  DATABASE_URL,
  DATABASE_REGION,
  DATABASE_ACCESS_KEY_ID,
  DATABASE_SECRET_ACCESS_KEY,
} from './config';

import routes from './routes';
import DbService from './dbService';

console.log('Starting authentication service');

(async () => {
  try {
    const dynamodb = new AWS.DynamoDB({
      region: DATABASE_REGION,
      endpoint: DATABASE_URL,
      accessKeyId: DATABASE_ACCESS_KEY_ID,
      secretAccessKey: DATABASE_SECRET_ACCESS_KEY,
    });

    const app = express();
    app.disable('x-powered-by');

    app.use(bodyParser.json());

    const dbService = DbService({
      dynamodb,
      parseResponseItem: (item) => (item ? AWS.DynamoDB.Converter.unmarshall(item) : item),
    });
    await dbService.setUpDatabase();

    app.listen(PORT, () => console.log(`Listening on port ${PORT}!`));

    const routesDefinitions = routes({ dbService });

    const rootRouter = createRouterFromRouteObjects(routesDefinitions);

    console.log(routesDefinitions.map(({ path, method }) => `${path} (${method})`));

    app.use(rootRouter);

    process.on('SIGINT', async () => {
      process.exit(0);
    });
  } catch (error) {
    console.log('Authentication service has crashed.');
    console.error(error);
  }
})();
