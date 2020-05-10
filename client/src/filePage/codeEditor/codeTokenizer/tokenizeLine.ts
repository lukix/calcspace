import { unitToString } from '../mathParser';
import evaluateExpression from './evaluateExpression';
import { tokens, functions, unitsMap, units, unitsApplicableForResult } from './constants';

const ALL_WHITESPACES_REGEX = /\s/g;
const IS_SYMBOL_REGEX = /^[A-Za-z]\w*$/;

const sanitize = (str: string) => str.replace(ALL_WHITESPACES_REGEX, '');
const valueWithUnitToString = ({ number, unit }) => `${number}${unitToString(unit)}`;
const convertToComprehendibleUnit = ({ number, unit }) => {
  const unitString = unitToString(unit);
  const replacementUnit = units.find(
    ([symbol, { baseUnits }]) =>
      unitsApplicableForResult.includes(symbol) && unitToString(baseUnits) === unitString
  );
  if (!replacementUnit) {
    return { number, unit };
  }
  const [symbol, { multiplier }] = replacementUnit;
  return {
    number: number / multiplier,
    unit: [{ unit: symbol, power: 1 }],
  };
};

const createTokenizedLineWithError = ({ values, lineString, errorMessage }) => ({
  values,
  tokenizedLine: [
    {
      value: lineString,
      tags: [tokens.NORMAL, tokens.ERROR],
    },
    { value: `  Error: ${errorMessage}`, tags: [tokens.VIRTUAL] },
  ],
});

const tokenizeLine = (values, lineString) => {
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

  const splittedByEquals = lineString.split('=');
  if (splittedByEquals.length > 2) {
    return createTokenizedLineWithError({
      values,
      lineString,
      errorMessage: 'Only a single equal sign is allowed',
    });
  }
  const [symbolBeforeSanitization, expression] =
    splittedByEquals.length === 2 ? splittedByEquals : [null, splittedByEquals[0]];

  const symbol = symbolBeforeSanitization ? sanitize(symbolBeforeSanitization) : null;

  if (symbol !== null) {
    if (!symbol.match(IS_SYMBOL_REGEX)) {
      return createTokenizedLineWithError({
        values,
        lineString,
        errorMessage: 'Invalid value on the left side of the equal sign',
      });
    }

    if (values[symbol] !== undefined) {
      return createTokenizedLineWithError({
        values,
        lineString,
        errorMessage: `Variable "${symbol}" already exists. Variables cannot be redefined`,
      });
    }

    if (functions[symbol] !== undefined) {
      return createTokenizedLineWithError({
        values,
        lineString,
        errorMessage: `Variable cannot have the same name as an existing function "${symbol}"`,
      });
    }
  }

  const { result, error } = evaluateExpression(expression, values, functions, unitsMap);

  if (error) {
    return createTokenizedLineWithError({
      values,
      lineString,
      errorMessage: error,
    });
  }

  const showResult =
    result !== null &&
    sanitize(expression) !== valueWithUnitToString(convertToComprehendibleUnit(result));
  const resultString = showResult
    ? ` = ${valueWithUnitToString(convertToComprehendibleUnit(result))}`
    : '';

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
