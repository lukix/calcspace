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
  values: { [key: string]: number } = {},
  functions: { [key: string]: Function } = {},
  unitsMap: Map<
    string,
    { multiplier: number; baseUnits: Array<{ unit: string; power: number }> }
  > = new Map()
) => {
  const { symbol, expression, result, valid, error } = parseExpression(
    expressionString,
    values,
    functions,
    unitsMap
  );

  if (!valid) {
    return createEvaluationResult({
      error: {
        type: ERROR_TYPES.INVALID_EXPRESSION,
        message: `Error: ${error}`,
      },
      symbol,
      expression,
    });
  }

  if (values[symbol] !== undefined) {
    return createEvaluationResult({
      error: {
        type: ERROR_TYPES.INVALID_EXPRESSION,
        message: `Error: Variable "${symbol}" already exists. Variables cannot be redefined`,
      },
      symbol: null,
      expression,
    });
  }

  if (functions[symbol] !== undefined) {
    return createEvaluationResult({
      error: {
        type: ERROR_TYPES.INVALID_EXPRESSION,
        message: `Error: Variable cannot have the same name as an existing function "${symbol}"`,
      },
      symbol: null,
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
