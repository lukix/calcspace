import { parseExpression as parse, evaluateParsedExpression } from '../mathParser';

const createErrorResult = (error) => ({
  error,
  result: null,
});

const createValidResult = (result) => ({
  error: null,
  result,
});

const evaluateExpression = (
  expressionString: string,
  values: { [key: string]: { number: number; unit: Array<{ unit: string; power: number }> } } = {},
  functions: { [key: string]: Function } = {},
  unitsMap: Map<
    string,
    { multiplier: number; baseUnits: Array<{ unit: string; power: number }> }
  > = new Map()
) => {
  const { parsedExpression, isValid, errorMessage } = parse(expressionString);
  if (!isValid) {
    return createErrorResult(errorMessage);
  }
  try {
    const result = evaluateParsedExpression(parsedExpression, {
      values,
      functions,
      unitsMap,
    });
    return createValidResult(result);
  } catch (error) {
    if (error.isEvaluationError) {
      return createErrorResult(error.message);
    }
    console.error(error);
    return createErrorResult('Expression cannot be evaluated');
  }
};

export default evaluateExpression;
