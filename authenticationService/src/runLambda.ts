import { handler as lambdaHandler } from './awsLambdaAdapter';

const args = process.argv.slice(2);
const [method, path, body] = args;

const event = {
  requestContext: {
    http: {
      method,
      path,
    },
  },
  body,
};

(async () => {
  try {
    const result = await lambdaHandler(event);
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Lambda handler threw an error');
    console.error(error);
  }
})();
