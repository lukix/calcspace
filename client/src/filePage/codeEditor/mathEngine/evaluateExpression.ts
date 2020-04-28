import parseExpression from './parseExpression';
import ERROR_TYPES from './errorTypes';

const createEvaluationResult = (options) => ({
  result: null,
  error: null,
  symbol: null,
  expression: null,
  ...options,
});

const evaluateExpression = (
  expressionString: string,
  values: { [key: string]: number }
) => {
  const { symbol, expression, result, valid, error } = parseExpression(
    expressionString,
    values
  );

  if (!valid) {
    return createEvaluationResult({
      error: {
        type: ERROR_TYPES.INVALID_EXPRESSION,
        message: `Invalid expression: ${error}`,
      },
      symbol,
      expression,
    });
  }

  return createEvaluationResult({
    result,
    symbol,
    expression,
  });
};

export default evaluateExpression;
