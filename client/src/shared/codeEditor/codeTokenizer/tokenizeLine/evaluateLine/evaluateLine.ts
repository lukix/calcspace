import { functions, unitsMap } from './constants';
import formatNumber from './formatNumber';
import formatValueWithUnit from './formatValueWithUnit';
import convertToComprehendibleUnit from './convertToComprehendibleUnit';
import convertToDesiredUnit from './convertToDesiredUnit';
import { evaluateParsedExpression } from '../../../mathParser';

const evaluateLine = (
  values,
  customFunctions,
  lineParsingResult,
  { exponentialNotation = false }
) => {
  const templateResultObject = {
    error: null,
    isCommented: false,

    newVariable: null,
    newFunction: null,

    symbolRawString: '',
    expressionRawString: '',
    desiredUnitRawString: '',

    result: {
      value: null,
      numberString: '',
      exponentString: '',
      unitString: '',
      rawString: '',
    },
  };

  const { error, isCommented, symbol, expression, desiredUnit } = lineParsingResult;

  if (error) {
    return {
      ...templateResultObject,
      error: { message: error.message, start: error.start, end: error.end },
    };
  }

  if (isCommented) {
    return {
      ...templateResultObject,
      isCommented: true,
    };
  }

  if (!expression) {
    return {
      ...templateResultObject,
    };
  }

  if (symbol) {
    if (functions[symbol.parsedValue.name] !== undefined) {
      return {
        ...templateResultObject,
        error: {
          message: `Variable or function cannot have the same name as an existing function "${symbol.parsedValue.name}"`,
          start: null,
          end: null,
        },
      };
    }

    if (
      values[symbol.parsedValue.name] !== undefined ||
      customFunctions[symbol.parsedValue.name] !== undefined
    ) {
      return {
        ...templateResultObject,
        error: {
          message: `"${symbol.parsedValue.name}" has already been defined. Variables and functions cannot be redefined`,
          start: null,
          end: null,
        },
      };
    }
  }

  if (symbol && symbol.parsedValue.type === 'FUNCTION') {
    if (desiredUnit) {
      return {
        ...templateResultObject,
        error: {
          message: `Units are not allowed in function declaration`,
          start: desiredUnit.startIndex,
          end: null,
        },
      };
    }

    const newCustomFunction = (...args) => {
      try {
        const result = evaluateParsedExpression(expression.parsedValue, {
          values: {
            ...values,
            ...(symbol.parsedValue.arguments as string[]).reduce(
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
          err.message = `Error in function "${symbol.parsedValue.name}": ${err.message}`;
          err.startCharIndex = null;
          err.endCharIndex = null;
        }
        throw err;
      }
    };

    return {
      ...templateResultObject,

      newFunction: { [symbol.parsedValue.name]: newCustomFunction },

      symbolRawString: symbol.rawString,
      expressionRawString: expression.rawString,
    };
  }

  if (desiredUnit) {
    const unknownUnit = desiredUnit.parsedValue.find(({ unit }) => !unitsMap.has(unit));
    if (unknownUnit) {
      return {
        ...templateResultObject,
        error: {
          message: `Unknown unit "${unknownUnit.unit}"`,
          start: desiredUnit.startIndex,
          end: null,
        },
      };
    }
  }

  let result;
  try {
    result = evaluateParsedExpression(expression.parsedValue, {
      values,
      functions: {
        ...functions,
        ...customFunctions,
      },
      unitsMap,
    });
  } catch (error) {
    return {
      ...templateResultObject,
      error: {
        message: error.message,
        start: expression.startIndex + error.startCharIndex,
        end: expression.startIndex + error.endCharIndex,
      },
    };
  }

  let valueConvertedToDesiredUnit;
  try {
    valueConvertedToDesiredUnit =
      desiredUnit && convertToDesiredUnit(result, desiredUnit.parsedValue).number;
  } catch (error) {
    return {
      ...templateResultObject,
      error: {
        message: error.message,
        start: desiredUnit?.startIndex,
      },
    };
  }

  const resultObject = desiredUnit
    ? {
        ...formatNumber(valueConvertedToDesiredUnit, exponentialNotation),
        unitString: desiredUnit.sanitizedString.substring(
          1,
          desiredUnit.sanitizedString.length - 1
        ),
      }
    : formatValueWithUnit(convertToComprehendibleUnit(result), exponentialNotation);

  return {
    ...templateResultObject,

    newVariable: symbol ? { [symbol.sanitizedString]: result } : null,
    newFunction: null,

    symbolRawString: symbol?.rawString,
    expressionRawString: expression.rawString,
    desiredUnitRawString: desiredUnit?.rawString,

    result: {
      value: result,
      numberString: resultObject.numberString,
      exponentString: resultObject.exponentString,
      unitString: resultObject.unitString,
      rawString: [
        resultObject.numberString,
        resultObject.exponentString ? `·10^${resultObject.exponentString}` : '',
        resultObject.unitString,
      ].join(''),
    },
  };
};

export default evaluateLine;
