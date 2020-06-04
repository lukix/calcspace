import tokens from './tokens';
import symbolTypes from './symbolTypes';
import { EvaluationError } from './errors';
import parseUnits, { mergeDuplicatedUnits } from './parseUnits';
import unitToString from './unitToString';
import translateToBaseUnits from './translateToBaseUnits';
import calculateEffectiveUnitMultiplier from './calculateEffectiveUnitMultiplier';

const evaluateSubexpression = (subexpressionToken, values, functions, unitsMap) => {
  return evaluateSum(subexpressionToken.value, values, functions, unitsMap);
};

const evaluateFunction = (functionToken, values, functions, unitsMap) => {
  const func = functions[functionToken.name];
  if (typeof func !== 'function') {
    throw new EvaluationError(`Missing or invalid function ${functionToken.name}`, {
      start: functionToken.position,
      end: functionToken.positionEnd,
    });
  }
  const argumentValue = evaluateSum(
    functionToken.subexpressionContent,
    values,
    functions,
    unitsMap
  );
  const { number, unit } = func(argumentValue);
  return { number, unit };
};

const evaluateNumericSymbolWithUnit = (symbolToken, unitsMap) => {
  const parsedSymbolUnits = parseUnits(symbolToken.unit);
  parsedSymbolUnits.forEach(({ unit }) => {
    if (!unitsMap.has(unit)) {
      throw new EvaluationError(`Unknown unit "${unit}"`, {
        start: symbolToken.position,
        end: symbolToken.positionEnd,
      });
    }
  });
  const finalMultiplier = calculateEffectiveUnitMultiplier(parsedSymbolUnits, unitsMap);
  const baseUnitsTranslation = translateToBaseUnits(parsedSymbolUnits, unitsMap);
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
        throw new EvaluationError(`Missing value for symbol ${symbolToken.value}`, {
          start: symbolToken.position,
          end: symbolToken.positionEnd,
        });
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
      throw new EvaluationError(`Powers with units are not supported`, {
        start: elements[0].position,
        end: elements[elements.length - 1].positionEnd || null,
      });
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
  context: {
    values?: { [name: string]: { number: number; unit: Array<{ unit: string; power: number }> } };
    functions?: {
      [name: string]: (value: {
        number: number;
        unit: Array<{ unit: string; power: number }>;
      }) => { number: number; unit: Array<{ unit: string; power: number }> };
    };
    unitsMap?: Map<
      string,
      { multiplier: number; baseUnits: Array<{ unit: string; power: number }> }
    >;
  } = {}
) => {
  const { values = {}, functions = {}, unitsMap = new Map() } = context;
  const { number, unit } = evaluateSum(parsedExpression, values, functions, unitsMap);
  return { number, unit: unit.filter(({ power }) => power !== 0) };
};

export default evaluateParsedExpression;