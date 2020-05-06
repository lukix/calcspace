import tokens from './tokens';
import symbolTypes from './symbolTypes';
import { EvaluationError } from './errors';
import parseUnits, { mergeDuplicatedUnits } from './parseUnits';
import unitToString from './unitToString';

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
  const { number, unit } = func(argumentValue);
  if (typeof number !== 'number') {
    throw new EvaluationError(`Invalid result type from function ${functionToken.name}`);
  }
  if (!Array.isArray(unit)) {
    throw new EvaluationError(`Invalid result unit type from function ${functionToken.name}`);
  }
  return { number, unit };
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
  const baseUnitsTranslation = parsedSymbolUnits
    .map(({ unit, power }) => {
      const unitDefinition = unitsMap.get(unit);
      return unitDefinition.baseUnits.map((baseUnit) => ({
        ...baseUnit,
        power: baseUnit.power * power,
      }));
    })
    .flat();
  return {
    number: finalMultiplier * symbolToken.number,
    unit: baseUnitsTranslation,
  };
};

const evaluateSymbol = (
  symbolToken,
  values,
  unitsMap
): { number: number; unit: Array<{ unit: string; power: number }> } => {
  switch (symbolToken.symbolType) {
    case symbolTypes.NUMERIC:
      return { number: symbolToken.number, unit: [] };
    case symbolTypes.NUMERIC_WITH_UNIT:
      return evaluateNumericSymbolWithUnit(symbolToken, unitsMap);
    case symbolTypes.VARIABLE:
      const variableValue = values[symbolToken.value];
      if (!variableValue) {
        throw new EvaluationError(`Missing value for symbol ${symbolToken.value}`);
      }
      if (typeof variableValue.number !== 'number') {
        throw new EvaluationError(`Missing or invalid value for symbol ${symbolToken.value}`);
      }
      if (!Array.isArray(variableValue.unit)) {
        throw new EvaluationError(`Missing or invalid value for symbol unit ${symbolToken.value}`);
      }
      return variableValue;
    default:
      throw new EvaluationError(`Invalid symbol type "${symbolToken.symbolType}"`);
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
  const [firstElement, ...restElements] = evaluatedElements;
  restElements.forEach(({ unit }) => {
    if (unit.length > 0) {
      throw new EvaluationError(`Powers with units are not supported`);
    }
  });
  const effectivePower = [...restElements]
    .reverse()
    .reduce((acc, currentValue) => currentValue.number ** acc, 1);
  const resultUnit = firstElement.unit.map(({ unit, power }) => ({
    unit,
    power: power * effectivePower,
  }));
  return { number: firstElement.number ** effectivePower, unit: resultUnit };
};

const evaluateProduct = (elements, values, functions, unitsMap) => {
  const evaluatedElements = elements.map((element) =>
    Array.isArray(element)
      ? evaluatePower(element, values, functions, unitsMap)
      : evaluateToken(element, values, functions, unitsMap)
  );

  return {
    number: evaluatedElements.reduce((acc, currentValue) => acc * currentValue.number, 1),
    unit: mergeDuplicatedUnits(evaluatedElements.map(({ unit }) => unit).flat()),
  };
};

const evaluateSum = (elements, values, functions, unitsMap) => {
  const evaluatedElements = elements.map((element) =>
    Array.isArray(element)
      ? evaluateProduct(element, values, functions, unitsMap)
      : evaluateToken(element, values, functions, unitsMap)
  );
  const firstElementUnit = evaluatedElements[0].unit;
  const firstElementUnitString = unitToString(firstElementUnit);
  evaluatedElements.forEach(({ unit }) => {
    const unitString = unitToString(unit);
    if (firstElementUnitString !== unitString) {
      throw new EvaluationError(
        `Trying to add/subtract values with incompatible units: "${firstElementUnitString}" and "${unitString}"`
      );
    }
  });
  return {
    number: evaluatedElements.reduce((acc, currentValue) => acc + currentValue.number, 0),
    unit: firstElementUnit,
  };
};

const evaluateParsedExpression = (
  parsedExpression,
  { values = {}, functions = {}, unitsMap = new Map() } = {}
) => {
  const { number, unit } = evaluateSum(parsedExpression, values, functions, unitsMap);
  return { number, unit: unit.filter(({ power }) => power !== 0) };
};

export default evaluateParsedExpression;
