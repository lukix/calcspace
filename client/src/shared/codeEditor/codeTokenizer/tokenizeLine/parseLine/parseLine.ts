import splitLineIntoParts, { SplitLineError } from './splitLineIntoParts';
import parseSymbol, { ParseSymbolError } from './parsers/parseSymbol';
import parseExpression, { ParseExpressionError } from './parsers/parseExpression';
import parseResultUnit, { ParseResultUnitError } from './parsers/parseResultUnit';

const emptyResult = {
  error: null,
  isCommented: false,
  symbol: null,
  expression: null,
  desiredUnit: null,
};

const ALL_WHITESPACES_REGEX = /\s/g;
const sanitize = (str: string) => str.replace(ALL_WHITESPACES_REGEX, '');

const createGenericErrorResult = (lineString) => ({
  ...emptyResult,
  error: {
    message: 'Invalid line',
    start: 0,
    end: lineString.length,
  },
});

const createParsingErrorResponse = (parsingError, startIndex, stringLength) => ({
  ...emptyResult,
  error: {
    message: parsingError.message,
    start: (parsingError.start || 0) + startIndex,
    end: (parsingError.end || stringLength) + startIndex,
  },
});

const wrapResultWithError = (func) => {
  try {
    const result = func();
    return { result, error: null };
  } catch (error) {
    return { result: null, error };
  }
};

const getResultObject = (partObject, parseFunction) => {
  if (!partObject) {
    return null;
  }
  return {
    rawString: partObject.value,
    sanitizedString: sanitize(partObject.value),
    parsedValue: parseFunction(partObject.value),
    startIndex: partObject.startIndex,
    endIndex: partObject.startIndex + partObject.value.length,
  };
};

const parseLine = (lineString) => {
  const sanitizedLine = lineString.trimStart();

  if (sanitizedLine === '') {
    return {
      ...emptyResult,
    };
  }

  if (sanitizedLine.substring(0, 2) === '//') {
    return {
      ...emptyResult,
      isCommented: true,
    };
  }

  const { result: splitResult, error: splitError } = wrapResultWithError(() =>
    splitLineIntoParts(lineString)
  );

  if (splitError) {
    if (splitError instanceof SplitLineError) {
      return createParsingErrorResponse(splitError, 0, lineString.length);
    }
    console.error(splitError);
    return createGenericErrorResult(lineString);
  }

  const { symbolPart, expressionPart, resultUnitPart } = splitResult;

  try {
    const symbolResultObject = getResultObject(symbolPart, parseSymbol);
    const expressionResultObject = getResultObject(expressionPart, parseExpression);
    const desiredUnitResultObject = getResultObject(resultUnitPart, parseResultUnit);

    return {
      ...emptyResult,
      error: null,
      isCommented: false,
      symbol: symbolResultObject,
      expression: expressionResultObject,
      desiredUnit: desiredUnitResultObject,
    };
  } catch (error) {
    if (error instanceof ParseSymbolError) {
      return createParsingErrorResponse(error, 0, symbolPart.value.length);
    }
    if (error instanceof ParseExpressionError) {
      return createParsingErrorResponse(
        error,
        expressionPart.startIndex,
        expressionPart.value.length
      );
    }
    if (error instanceof ParseResultUnitError) {
      return createParsingErrorResponse(
        error,
        resultUnitPart.startIndex,
        resultUnitPart.value.length
      );
    }
    console.error(error);
    return createGenericErrorResult(lineString);
  }
};

export default parseLine;
