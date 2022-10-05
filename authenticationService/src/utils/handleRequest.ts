import { match as matchPath } from 'node-match-path';

const handleRequest = async (routesDefinitions, { method, path, body }) => {
  const matchingDefinition = routesDefinitions.find((definition) => {
    const methodMathes = definition.method.toLocaleLowerCase() === method.toLocaleLowerCase();
    const { matches: pathMatches } = matchPath(definition.path, path);
    return methodMathes && pathMatches;
  });

  if (!matchingDefinition) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'Not found' }),
    };
  }

  const req = {
    params: matchPath(matchingDefinition.path, path).params,
    body,
  };

  try {
    const validate = matchingDefinition.validate || (() => null);
    const validationError = await validate(req);
    if (validationError) {
      return {
        statusCode: 400,
        body: JSON.stringify(validationError),
      };
    }
    const result: { status?: number; response?: Record<string, unknown> } =
      (await matchingDefinition.handler(req)) || {};
    return {
      statusCode: result.status || 200,
      body: JSON.stringify(result.response),
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};

export default handleRequest;
