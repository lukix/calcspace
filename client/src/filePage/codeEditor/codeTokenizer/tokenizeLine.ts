import {
  unitToString,
  translateToBaseUnits,
  calculateEffectiveUnitMultiplier,
} from '../mathParser';
import evaluateExpression from './evaluateExpression';
import { tokens, functions, unitsMap, units, unitsApplicableForResult } from './constants';
import getUnitFromResultUnitString from './getUnitFromResultUnitString';

const ALL_WHITESPACES_REGEX = /\s/g;
const IS_SYMBOL_REGEX = /^[A-Za-z]\w*$/;

const sanitize = (str: string) => str.replace(ALL_WHITESPACES_REGEX, '');
const numberToString = (number: number, exponentialNotation: boolean) => {
  if (exponentialNotation && (number >= 1e4 || number < 1e-4)) {
    const orderOfMagnitude = Math.floor(Math.log10(number));
    return `${number}`.split('').includes('e')
      ? `${number}`
      : `${number / 10 ** orderOfMagnitude}e${orderOfMagnitude}`;
  }
  return `${number}`;
};
const valueWithUnitToString = ({ number, unit }, exponentialNotation) =>
  `${numberToString(number, exponentialNotation)}${unitToString(unit)}`;
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

const convertToDesiredUnit = ({ number, unit }, desiredUnit) => {
  const desiredUnitInBaseUnits = translateToBaseUnits(desiredUnit, unitsMap);
  const unitString = unitToString(translateToBaseUnits(unit, unitsMap));
  const desiredUnitString = unitToString(desiredUnitInBaseUnits);
  if (desiredUnitString === '') {
    throw new Error('Desired result unit is empty after simplification');
  }
  if (unitString !== desiredUnitString) {
    throw new Error(`"${unitString}" cannot be converted to "${unitToString(desiredUnit)}"`);
  }
  const unitMultiplier = calculateEffectiveUnitMultiplier(unit, unitsMap);
  const desiredUnitMultiplier = calculateEffectiveUnitMultiplier(desiredUnit, unitsMap);
  const multiplier = unitMultiplier / desiredUnitMultiplier;
  return { number: number * multiplier, unit: desiredUnit };
};

const createTokenizedLineWithError = ({
  values,
  lineString,
  errorMessage,
  start = null,
  end = null,
}) => {
  const errorSourceStart = start === null ? 0 : start;
  const errorSourceEnd = end === null ? lineString.length : end;
  return {
    values,
    tokenizedLine: [
      {
        value: lineString.substring(0, errorSourceStart),
        tags: [tokens.NORMAL, tokens.ERROR],
      },
      {
        value: lineString.substring(start, errorSourceEnd),
        tags: [tokens.NORMAL, tokens.ERROR, tokens.ERROR_SOURCE],
      },
      {
        value: lineString.substring(errorSourceEnd),
        tags: [tokens.NORMAL, tokens.ERROR],
      },
      { value: `  Error: ${errorMessage}`, tags: [tokens.VIRTUAL] },
    ].filter(({ value }) => value !== ''),
  };
};

const classifyPartsSplittedByEqualSigns = (parts: Array<string>) => {
  if (parts.length === 1) {
    return { symbolBeforeSanitization: null, expression: parts[0], resultUnitPart: null };
  }
  if (
    parts[parts.length - 1].split('').includes('[') &&
    parts[parts.length - 1].split('').includes(']')
  ) {
    return parts.length === 2
      ? { symbolBeforeSanitization: null, expression: parts[0], resultUnitPart: parts[1] }
      : { symbolBeforeSanitization: parts[0], expression: parts[1], resultUnitPart: parts[2] };
  }
  return { symbolBeforeSanitization: parts[0], expression: parts[1], resultUnitPart: null };
};

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
  if (partsSplittedByEqualSigns.length > 3) {
    return createTokenizedLineWithError({
      values,
      lineString,
      errorMessage: 'Too many equal signs',
      start:
        partsSplittedByEqualSigns[0].length +
        partsSplittedByEqualSigns[1].length +
        partsSplittedByEqualSigns[2].length,
    });
  }
  if (
    partsSplittedByEqualSigns.length === 3 &&
    !(
      partsSplittedByEqualSigns[2].split('').includes('[') ||
      partsSplittedByEqualSigns[2].split('').includes(']')
    )
  ) {
    return createTokenizedLineWithError({
      values,
      lineString,
      errorMessage: 'Expected square brackets [...] after last "="',
      start:
        partsSplittedByEqualSigns[0].length +
        partsSplittedByEqualSigns[1].length +
        partsSplittedByEqualSigns[2].length,
    });
  }
  const {
    symbolBeforeSanitization,
    expression,
    resultUnitPart,
  } = classifyPartsSplittedByEqualSigns(partsSplittedByEqualSigns);

  const symbol = symbolBeforeSanitization ? sanitize(symbolBeforeSanitization) : null;

  if (symbol !== null) {
    if (!symbol.match(IS_SYMBOL_REGEX)) {
      return createTokenizedLineWithError({
        values,
        lineString,
        errorMessage: 'Invalid value on the left side of the equal sign',
        end: lineString.indexOf('='),
      });
    }

    if (values[symbol] !== undefined) {
      return createTokenizedLineWithError({
        values,
        lineString,
        errorMessage: `Variable "${symbol}" already exists. Variables cannot be redefined`,
        end: lineString.indexOf('='),
      });
    }

    if (functions[symbol] !== undefined) {
      return createTokenizedLineWithError({
        values,
        lineString,
        errorMessage: `Variable cannot have the same name as an existing function "${symbol}"`,
        end: lineString.indexOf('='),
      });
    }
  }

  const { unit: resultUnit, error: resultUnitError } = resultUnitPart
    ? getUnitFromResultUnitString(resultUnitPart)
    : { unit: null, error: null };
  if (resultUnitError) {
    return createTokenizedLineWithError({
      values,
      lineString,
      errorMessage: resultUnitError,
      start: lineString.lastIndexOf('=') + 1,
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
    const equalSignPosition = lineString.indexOf('=') === -1 ? 0 : lineString.indexOf('=') + 1;
    return createTokenizedLineWithError({
      values,
      lineString,
      errorMessage: error,
      start: (startCharIndex || 0) + equalSignPosition,
      end: endCharIndex ? endCharIndex + equalSignPosition : null,
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
      start: lineString.lastIndexOf('=') + 1,
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
