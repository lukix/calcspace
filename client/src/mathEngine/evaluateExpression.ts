import parseExpression from './parseExpression';
import ERROR_TYPES from './errorTypes';

const evaluateExpression = (
  expressionString: string,
  values: { [key: string]: number }
) => {
  const {
    symbol,
    expression,
    parsedExpression,
    valid,
    error,
  } = parseExpression(expressionString);

  if (!valid) {
    return {
      result: null,
      error: {
        type: ERROR_TYPES.INVALID_EXPRESSION,
        message: `Invalid expression: ${error}`,
      },
      symbol,
      expression,
    };
  }

  try {
    const result = parsedExpression.evaluate(values);
    return {
      result,
      error: null,
      symbol,
      expression,
    };
  } catch (e) {
    return {
      result: null,
      error: { type: ERROR_TYPES.UNDEFINED_VARIABLE, message: `${e}` },
      symbol,
      expression,
    };
  }
};

export default evaluateExpression;
