import { parseExpression as parse, evaluateParsedExpression } from '../mathParser';

const ERRORS = {
  SINGLE_EQUAL_ALLOWED: 'Only a single equal sign is allowed',
  INVALID_VALUE_ON_THE_LEFT_OF_EQUAL_SIGN: 'Invalid value on the left side of the equal sign',
};

const ALL_WHITESPACES_REGEX = /\s/g;
const IS_SYMBOL_REGEX = /^[A-Za-z]\w*$/;

const createErrorResult = (error) => ({
  valid: false,
  error,
  symbol: null,
  expression: null,
  parsedExpression: null,
  result: null,
});

const createValidResult = (symbol, expression, result) => ({
  valid: true,
  error: null,
  symbol,
  expression,
  result,
});

const sanitize = (str: string) => str.replace(ALL_WHITESPACES_REGEX, '');

const parseExpression = (
  expressionToParse: string,
  values = {},
  functions = {},
  unitsMap = new Map()
) => {
  const splittedByEquals = expressionToParse.split('=');
  if (splittedByEquals.length > 2) {
    return createErrorResult(ERRORS.SINGLE_EQUAL_ALLOWED);
  }
  const [symbolBeforeSanitization, expression] =
    splittedByEquals.length === 2 ? splittedByEquals : [null, splittedByEquals[0]];

  const symbol = symbolBeforeSanitization ? sanitize(symbolBeforeSanitization) : null;

  if (symbol !== null && !symbol.match(IS_SYMBOL_REGEX)) {
    return createErrorResult(ERRORS.INVALID_VALUE_ON_THE_LEFT_OF_EQUAL_SIGN);
  }

  const { parsedExpression, isValid, errorMessage } = parse(expression);
  if (!isValid) {
    return createErrorResult(errorMessage);
  }
  try {
    const result = evaluateParsedExpression(parsedExpression, {
      values,
      functions,
      unitsMap,
    });
    return createValidResult(symbol, sanitize(expression), result);
  } catch (error) {
    if (error.isEvaluationError) {
      return createErrorResult(error.message);
    }
    console.error(error);
    return createErrorResult('Expression cannot be evaluated');
  }
};

export default parseExpression;
