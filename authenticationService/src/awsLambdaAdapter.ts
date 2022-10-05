import AWS from 'aws-sdk';

import {
  DATABASE_URL,
  DATABASE_REGION,
  DATABASE_ACCESS_KEY_ID,
  DATABASE_SECRET_ACCESS_KEY,
} from './config';

import routes from './routes';
import DbService from './dbService';
import handleRequest from './utils/handleRequest';

const rootRequestHandler = async (event) => {
  try {
    const { requestContext, body: bodyString } = event;
    const { method, path } = requestContext.http;
    const body = bodyString && JSON.stringify(bodyString);

    const dynamodb = new AWS.DynamoDB({
      region: DATABASE_REGION,
      endpoint: DATABASE_URL,
      accessKeyId: DATABASE_ACCESS_KEY_ID,
      secretAccessKey: DATABASE_SECRET_ACCESS_KEY,
    });

    const dbService = DbService({
      dynamodb,
      parseResponseItem: (item) => (item ? AWS.DynamoDB.Converter.unmarshall(item) : item),
    });

    const routesDefinitions = routes({ dbService });

    return await handleRequest(routesDefinitions, { method, path, body });
  } catch (error) {
    console.log('Router has failed to process the request');
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Router has failed to process the request' }),
    };
  }
};

export const handler = rootRequestHandler;
