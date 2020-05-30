import evaluateExpression from '../evaluateExpression';
import { tokens, functions, unitsMap } from '../constants';
import getUnitFromResultUnitString from '../getUnitFromResultUnitString';
import numberToString from './numberToString';
import valueWithUnitToString from './valueWithUnitToString';
import convertToComprehendibleUnit from './convertToComprehendibleUnit';
import convertToDesiredUnit from './convertToDesiredUnit';
import createTokenizedLineWithError from './createTokenizedLineWithError';
import classifyPartsSplittedByEqualSigns from './classifyPartsSplittedByEqualSigns';
import validateSplittedParts from './validateSplittedParts';
import validateSymbol from './validateSymbol';

const ALL_WHITESPACES_REGEX = /\s/g;
const sanitize = (str: string) => str.replace(ALL_WHITESPACES_REGEX, '');

const tokenizeLine = (values, lineString, { exponentialNotation = false }) => {
  const sanitizedExpression = lineString.trimStart();

  if (sanitizedExpression === '') {
    return {
      values,
      tokenizedLine: [],
    };
  }

  if (sanitizedExpression.substring(0, 2) === '//') {
    return {
      values,
      tokenizedLine: [{ value: lineString, tags: [tokens.COMMENT] }],
    };
  }

  const partsSplittedByEqualSigns = lineString.split('=');
  const splittedPartsValidationError = validateSplittedParts({
    partsSplittedByEqualSigns,
    values,
    lineString,
  });
  if (splittedPartsValidationError) {
    return splittedPartsValidationError;
  }
  const {
    symbolBeforeSanitization,
    expression,
    resultUnitPart,
  } = classifyPartsSplittedByEqualSigns(partsSplittedByEqualSigns);

  const symbol = symbolBeforeSanitization ? sanitize(symbolBeforeSanitization) : null;

  const symbolValidationError = validateSymbol({ symbol, values, lineString, functions });
  if (symbolValidationError) {
    return symbolValidationError;
  }

  const expressionPartBeginningIndex = symbolBeforeSanitization
    ? symbolBeforeSanitization.length + 1
    : 0;

  const { unit: resultUnit, error: resultUnitError } = resultUnitPart
    ? getUnitFromResultUnitString(resultUnitPart)
    : { unit: null, error: null };
  if (resultUnitError) {
    return createTokenizedLineWithError({
      values,
      lineString,
      errorMessage: resultUnitError,
      start: expressionPartBeginningIndex,
    });
  }

  if (resultUnit) {
    const unknownUnit = resultUnit.find(({ unit }) => !unitsMap.has(unit));
    if (unknownUnit) {
      return createTokenizedLineWithError({
        values,
        lineString,
        errorMessage: `Unknown unit "${unknownUnit.unit}"`,
        start: lineString.lastIndexOf('=') + 1,
      });
    }
  }

  const { result, error, startCharIndex, endCharIndex } = evaluateExpression(
    expression,
    values,
    functions,
    unitsMap
  );

  if (error) {
    return createTokenizedLineWithError({
      values,
      lineString,
      errorMessage: error,
      start: (startCharIndex || 0) + expressionPartBeginningIndex,
      end: endCharIndex ? (endCharIndex || 0) + expressionPartBeginningIndex : null,
    });
  }

  let resultValueString;
  try {
    resultValueString = resultUnit
      ? `${numberToString(
          convertToDesiredUnit(result, resultUnit).number,
          exponentialNotation
        )}${resultUnitPart?.trim().substring(1, resultUnitPart?.trim().length - 1)}`
      : valueWithUnitToString(convertToComprehendibleUnit(result), exponentialNotation);
  } catch (error) {
    return createTokenizedLineWithError({
      values,
      lineString,
      errorMessage: error.message,
      start: expressionPartBeginningIndex,
    });
  }

  const showResult = result !== null && (sanitize(expression) !== resultValueString || resultUnit);
  const resultString = showResult ? ` = ${resultValueString}` : '';

  const tokenizedLine = [
    {
      value: lineString,
      tags: [tokens.NORMAL],
    },
    ...(resultString === '' ? [] : [{ value: resultString, tags: [tokens.VIRTUAL] }]),
  ];

  return {
    values: symbol && result !== null ? { [symbol]: result } : {},
    tokenizedLine,
  };
};

export default tokenizeLine;
