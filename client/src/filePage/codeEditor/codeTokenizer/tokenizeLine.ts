import { unitToString } from '../mathParser';
import evaluateExpression from './evaluateExpression';
import { tokens, functions, unitsMap, units, unitsApplicableForResult } from './constants';

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

const tokenizeLine = (values, expression) => {
  const sanitizedExpression = expression.trimStart();

  if (sanitizedExpression === '') {
    return {
      values,
      tokenizedLine: [],
    };
  }

  if (sanitizedExpression.substring(0, 2) === '//') {
    return {
      values,
      tokenizedLine: [{ value: expression, tags: [tokens.COMMENT] }],
    };
  }

  const { result, error, symbol, expression: expStr } = evaluateExpression(
    expression,
    values,
    functions,
    unitsMap
  );
  const showResult =
    result !== null && expStr !== valueWithUnitToString(convertToComprehendibleUnit(result));
  const resultString = showResult
    ? ` = ${valueWithUnitToString(convertToComprehendibleUnit(result))}`
    : '';
  const tokenizedLine = [
    {
      value: expression,
      tags: [tokens.NORMAL, ...(error ? [tokens.ERROR] : [])],
    },
    ...(resultString === '' ? [] : [{ value: resultString, tags: [tokens.VIRTUAL] }]),
    ...(!error ? [] : [{ value: `  ${error.message}`, tags: [tokens.VIRTUAL] }]),
  ];

  return {
    values: symbol && result !== null ? { [symbol]: result } : {},
    tokenizedLine,
  };
};

export default tokenizeLine;
