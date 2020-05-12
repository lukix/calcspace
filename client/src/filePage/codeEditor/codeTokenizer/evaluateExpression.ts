import { parseExpression as parse, evaluateParsedExpression } from '../mathParser';

const createErrorResult = (error, { startCharIndex = null, endCharIndex = null } = {}) => ({
  error,
  result: null,
  startCharIndex,
  endCharIndex,
});

const createValidResult = (result) => ({
  error: null,
  result,
  startCharIndex: null,
  endCharIndex: null,
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
  const { parsedExpression, isValid, errorMessage, startCharIndex, endCharIndex } = parse(
    expressionString
  );
  if (!isValid) {
    return createErrorResult(errorMessage, { startCharIndex, endCharIndex });
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
      return createErrorResult(error.message, {
        startCharIndex: error.startCharIndex,
        endCharIndex: error.endCharIndex,
      });
    }
    console.error(error);
    return createErrorResult('Expression cannot be evaluated');
  }
};

export default evaluateExpression;
