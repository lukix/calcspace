import { tokens, functions, unitsMap } from '../constants';
import formatNumber from './formatNumber';
import formatValueWithUnit from './formatValueWithUnit';
import convertToComprehendibleUnit from './convertToComprehendibleUnit';
import convertToDesiredUnit from './convertToDesiredUnit';
import createTokenizedLineWithError from './createTokenizedLineWithError';
import { evaluateParsedExpression } from '../../mathParser';

import parseLine from './parseLine';

const ALL_WHITESPACES_REGEX = /\s/g;
const sanitize = (str: string) => str.replace(ALL_WHITESPACES_REGEX, '');

const tokenizeLine = (
  values,
  customFunctions,
  customFunctionsRaw,
  lineString,
  { exponentialNotation = false, showResultUnit = true }
) => {
  const { error, isCommented, symbol, expression, resultUnit, meta } = parseLine(lineString);

  if (error) {
    return createTokenizedLineWithError({
      values,
      customFunctions,
      customFunctionsRaw,
      lineString,
      errorMessage: error.message,
      start: error.start,
      end: error.end,
    });
  }

  if (isCommented) {
    return {
      values,
      customFunctions,
      customFunctionsRaw,
      tokenizedLine: [{ value: lineString, tags: [tokens.COMMENT] }],
    };
  }

  if (!expression) {
    return {
      values,
      customFunctions,
      customFunctionsRaw,
      tokenizedLine: [],
    };
  }

  if (symbol) {
    if (functions[symbol.name] !== undefined) {
      return createTokenizedLineWithError({
        values,
        customFunctions,
        customFunctionsRaw,
        lineString,
        errorMessage: `Variable or function cannot have the same name as an existing function "${symbol.name}"`,
      });
    }

    if (values[symbol.name] !== undefined || customFunctions[symbol.name] !== undefined) {
      return createTokenizedLineWithError({
        values,
        customFunctions,
        customFunctionsRaw,
        lineString,
        errorMessage: `"${symbol.name}" has already been defined. Variables and functions cannot be redefined`,
      });
    }
  }

  if (symbol && symbol.type === 'FUNCTION') {
    if (resultUnit) {
      return createTokenizedLineWithError({
        values,
        customFunctions,
        customFunctionsRaw,
        lineString,
        errorMessage: `Units are not allowed in function declaration`,
        start: meta.resultUnitStartIndex,
      });
    }

    const newCustomFunction = (...args) => {
      try {
        const result = evaluateParsedExpression(expression, {
          values: {
            ...values,
            ...(symbol.arguments as string[]).reduce(
              (acc, argumentName, index) => ({
                ...acc,
                [argumentName]: args[index],
              }),
              {}
            ),
          },
          functions: {
            ...functions,
            ...customFunctions,
          },
          unitsMap,
        });
        return result;
      } catch (err) {
        if (err.message) {
          err.message = `Error in function "${symbol.name}": ${err.message}`;
        }
        throw err;
      }
    };

    return {
      values: {},
      customFunctions: {
        [symbol.name as string]: newCustomFunction,
      },
      customFunctionsRaw: {
        [symbol.name as string]: lineString,
      },
      tokenizedLine: [
        {
          value: lineString,
          tags: [tokens.NORMAL],
        },
      ],
    };
  }

  if (resultUnit) {
    const unknownUnit = resultUnit.find(({ unit }) => !unitsMap.has(unit));
    if (unknownUnit) {
      return createTokenizedLineWithError({
        values,
        customFunctions,
        customFunctionsRaw,
        lineString,
        errorMessage: `Unknown unit "${unknownUnit.unit}"`,
        start: meta.resultUnitStartIndex,
      });
    }
  }

  let result;
  try {
    result = evaluateParsedExpression(expression, {
      values,
      functions: {
        ...functions,
        ...customFunctions,
      },
      unitsMap,
    });
  } catch (err) {
    return createTokenizedLineWithError({
      values,
      customFunctions,
      customFunctionsRaw,
      lineString,
      errorMessage: err.message,
      start: meta.expressionStartIndex + err.startCharIndex,
      end: meta.expressionStartIndex + err.endCharIndex,
    });
  }

  let valueConvertedToDesiredUnit;
  try {
    valueConvertedToDesiredUnit = resultUnit && convertToDesiredUnit(result, resultUnit).number;
  } catch (error) {
    return createTokenizedLineWithError({
      values,
      customFunctions,
      customFunctionsRaw,
      lineString,
      errorMessage: error.message,
      start: meta.resultUnitStartIndex,
    });
  }

  const resultObject = resultUnit
    ? {
        ...formatNumber(valueConvertedToDesiredUnit, exponentialNotation),
        unitString: meta.resultUnitString
          ?.trim()
          .substring(1, meta.resultUnitString?.trim().length - 1),
      }
    : formatValueWithUnit(convertToComprehendibleUnit(result), exponentialNotation);

  const resultValueString: string = [
    resultObject.numberString,
    resultObject.exponentString,
    resultObject.unitString,
  ].join('');
  const showResult: boolean =
    result !== null &&
    (sanitize(meta.expressionString) !== resultValueString || Boolean(resultUnit));
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
      value: resultUnit
        ? showResultUnit
          ? lineString.substring(0, meta.resultUnitStartIndex - 1)
          : lineString.substring(0, meta.resultUnitStartIndex - 1).trimEnd()
        : lineString,
      tags: [tokens.NORMAL],
    },
    ...(resultUnit && showResultUnit
      ? [{ value: `=${meta.resultUnitString}`, tags: [tokens.NORMAL, tokens.DESIRED_UNIT] }]
      : []),
    ...resultTokens,
  ];

  return {
    values: symbol && result !== null ? { [symbol.name]: result } : {},
    customFunctions,
    customFunctionsRaw,
    tokenizedLine,
  };
};

export default tokenizeLine;
