import evaluateExpression from '../evaluateExpression';
import { tokens, functions, unitsMap } from '../constants';
import getUnitFromResultUnitString from '../getUnitFromResultUnitString';
import formatNumber from './formatNumber';
import formatValueWithUnit from './formatValueWithUnit';
import convertToComprehendibleUnit from './convertToComprehendibleUnit';
import convertToDesiredUnit from './convertToDesiredUnit';
import createTokenizedLineWithError from './createTokenizedLineWithError';
import classifyPartsSplittedByEqualSigns from './classifyPartsSplittedByEqualSigns';
import validateSplittedParts from './validateSplittedParts';
import validateSymbol from './validateSymbol';

const ALL_WHITESPACES_REGEX = /\s/g;
const sanitize = (str: string) => str.replace(ALL_WHITESPACES_REGEX, '');

const tokenizeLine = (
  values,
  lineString,
  { exponentialNotation = false, showResultUnit = true }
) => {
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

  const resultUnitPartBeginningIndex =
    (symbolBeforeSanitization ? symbolBeforeSanitization.length + 1 : 0) +
    (expression ? expression.length + 1 : 0);

  const { unit: resultUnit, error: resultUnitError } = resultUnitPart
    ? getUnitFromResultUnitString(resultUnitPart)
    : { unit: null, error: null };
  if (resultUnitError) {
    return createTokenizedLineWithError({
      values,
      lineString,
      errorMessage: resultUnitError,
      start: resultUnitPartBeginningIndex,
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

  let valueConvertedToDesiredUnit;
  try {
    valueConvertedToDesiredUnit = resultUnit && convertToDesiredUnit(result, resultUnit).number;
  } catch (error) {
    return createTokenizedLineWithError({
      values,
      lineString,
      errorMessage: error.message,
      start: expressionPartBeginningIndex,
    });
  }

  const resultObject = resultUnit
    ? {
        ...formatNumber(valueConvertedToDesiredUnit, exponentialNotation),
        unitString: resultUnitPart?.trim().substring(1, resultUnitPart?.trim().length - 1),
      }
    : formatValueWithUnit(convertToComprehendibleUnit(result), exponentialNotation);

  const resultValueString: string = [
    resultObject.numberString,
    resultObject.exponentString,
    resultObject.unitString,
  ].join('');
  const showResult: boolean =
    result !== null && (sanitize(expression) !== resultValueString || Boolean(resultUnit));
  const resultTokens = !showResult
    ? []
    : resultObject.exponentString
    ? [
        { value: ` = ${resultObject.numberString}·10`, tags: [tokens.VIRTUAL] },
        { value: resultObject.exponentString, tags: [tokens.VIRTUAL, tokens.POWER_ALIGN] },
        ...(resultObject.unitString
          ? [{ value: resultObject.unitString, tags: [tokens.VIRTUAL] }]
          : []),
      ]
    : [
        {
          value: ` = ${resultObject.numberString}${resultObject.unitString}`,
          tags: [tokens.VIRTUAL],
        },
      ];

  const tokenizedLine = [
    {
      value: resultUnitPart
        ? showResultUnit
          ? lineString.substring(0, resultUnitPartBeginningIndex - 1)
          : lineString.substring(0, resultUnitPartBeginningIndex - 1).trimEnd()
        : lineString,
      tags: [tokens.NORMAL],
    },
    ...(resultUnitPart && showResultUnit
      ? [{ value: `=${resultUnitPart}`, tags: [tokens.NORMAL, tokens.DESIRED_UNIT] }]
      : []),
    ...resultTokens,
  ];

  return {
    values: symbol && result !== null ? { [symbol]: result } : {},
    tokenizedLine,
  };
};

export default tokenizeLine;
