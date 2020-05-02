import tokens from './tokens';
import symbolTypes from './symbolTypes';
import { EvaluationError } from './errors';
import parseUnits from './parseUnits';

const evaluateSubexpression = (subexpressionToken, values, functions, unitsMap) => {
  return evaluateSum(subexpressionToken.value, values, functions, unitsMap);
};

const evaluateFunction = (functionToken, values, functions, unitsMap) => {
  const func = functions[functionToken.name];
  if (typeof func !== 'function') {
    throw new EvaluationError(`Missing or invalid function ${functionToken.name}`);
  }
  const argumentValue = evaluateSum(
    functionToken.subexpressionContent,
    values,
    functions,
    unitsMap
  );
  const result = func(argumentValue);
  if (typeof result !== 'number') {
    throw new EvaluationError(`Invalid result type from function ${functionToken.name}`);
  }
  return result;
};

const evaluateNumericSymbolWithUnit = (symbolToken, unitsMap) => {
  const parsedSymbolUnits = parseUnits(symbolToken.unit);
  const multipliers = parsedSymbolUnits.map(({ unit, power }) => {
    if (!unitsMap.has(unit)) {
      throw new EvaluationError(`Unknown unit "${unit}"`);
    }
    return unitsMap.get(unit).multiplier ** power;
  });
  const finalMultiplier = multipliers.reduce((acc, curr) => acc * curr);
  return finalMultiplier * symbolToken.number;
};

const evaluateSymbol = (symbolToken, values, unitsMap) => {
  switch (symbolToken.symbolType) {
    case symbolTypes.NUMERIC:
      return symbolToken.number;
    case symbolTypes.NUMERIC_WITH_UNIT:
      return evaluateNumericSymbolWithUnit(symbolToken, unitsMap);
    case symbolTypes.VARIABLE:
      const value = values[symbolToken.value];
      if (typeof value !== 'number') {
        throw new EvaluationError(`Missing or invalid value for symbol ${symbolToken.value}`);
      }
      return value;
  }
};

const evaluateToken = (token, values, functions, unitsMap) => {
  switch (token.type) {
    case tokens.SYMBOL:
      return evaluateSymbol(token, values, unitsMap);
    case tokens.SUBEXPRESSION:
      return evaluateSubexpression(token, values, functions, unitsMap);
    case tokens.FUNCTION:
      return evaluateFunction(token, values, functions, unitsMap);
    default:
      throw new EvaluationError(`Unexpected token type '${token.type}'`);
  }
};

const evaluatePower = (elements, values, functions, unitsMap) => {
  if (elements.length === 0) {
    throw new EvaluationError(`Found empty subexpression`);
  }
  const evaluatedElements = elements.map((element) =>
    evaluateToken(element, values, functions, unitsMap)
  );
  return [...evaluatedElements].reverse().reduce((acc, currentValue) => currentValue ** acc);
};

const evaluateProduct = (elements, values, functions, unitsMap) => {
  const evaluatedElements = elements.map((element) =>
    Array.isArray(element)
      ? evaluatePower(element, values, functions, unitsMap)
      : evaluateToken(element, values, functions, unitsMap)
  );
  return evaluatedElements.reduce((acc, currentValue) => acc * currentValue, 1);
};

const evaluateSum = (elements, values, functions, unitsMap) => {
  const evaluatedElements = elements.map((element) =>
    Array.isArray(element)
      ? evaluateProduct(element, values, functions, unitsMap)
      : evaluateToken(element, values, functions, unitsMap)
  );
  return evaluatedElements.reduce((acc, currentValue) => acc + currentValue, 0);
};

const evaluateParsedExpression = (
  parsedExpression,
  { values = {}, functions = {}, unitsMap = new Map() } = {}
) => {
  return evaluateSum(parsedExpression, values, functions, unitsMap);
};

export default evaluateParsedExpression;
