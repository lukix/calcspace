import parser from './parser';

const ERRORS = {
  SINGLE_EQUAL_ALLOWED: 'Only a single equal sign is allowed',
  SINGLE_SYMBOL_ON_THE_LEFT_ALLOWED:
    'Only a single symbol is allowed on the left side of the equal sign',
};

const ALL_WHITESPACES_REGEX = /\s/g;
const IS_SYMBOL_REGEX = /^[A-Za-z]\w*$/;

const createErrorResult = error => ({
  valid: false,
  error,
  symbol: null,
  expression: null,
  parsedExpression: null,
});

const createValidResult = (symbol, expression, parsedExpression) => ({
  valid: true,
  error: null,
  symbol,
  expression,
  parsedExpression,
});

const parseExpression = (expressionToParse: string) => {
  const expressionWithoutWhitespaces = expressionToParse.replace(
    ALL_WHITESPACES_REGEX,
    ''
  );
  const splittedByEquals = expressionWithoutWhitespaces.split('=');
  if (splittedByEquals.length > 2) {
    return createErrorResult(ERRORS.SINGLE_EQUAL_ALLOWED);
  }
  const [symbol, expression] =
    splittedByEquals.length === 2
      ? splittedByEquals
      : [null, splittedByEquals[0]];

  // TODO: Validate expression using lib

  if (symbol !== null && !symbol.match(IS_SYMBOL_REGEX)) {
    return createErrorResult(ERRORS.SINGLE_SYMBOL_ON_THE_LEFT_ALLOWED);
  }

  try {
    const parsedExpression = parser.parse(expression);
    return createValidResult(symbol, expression, parsedExpression);
  } catch (parsingError) {
    return createErrorResult(parsingError);
  }
};

export default parseExpression;
