import parseExpression from './parseExpression';
import ERROR_TYPES from './errorTypes';

const evaluateExpression = (
  expressionString: string,
  values: { [key: string]: number }
) => {
  const { symbol, parsedExpression, valid, error } = parseExpression(
    expressionString
  );

  if (!valid) {
    return {
      result: null,
      error: {
        type: ERROR_TYPES.INVALID_EXPRESSION,
        message: `Invalid expression: ${error}`,
      },
      symbol,
    };
  }

  try {
    const result = parsedExpression.evaluate(values);
    return {
      result,
      error: null,
      symbol,
    };
  } catch (e) {
    return {
      result: null,
      error: { type: ERROR_TYPES.UNDEFINED_VARIABLE, message: e },
      symbol,
    };
  }
};

export default evaluateExpression;
