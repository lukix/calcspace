import { findRequiredSymbols } from '../expressionParser';

const checkFunctionForUndefinedSymbols = (symbol, expression, values, functions) => {
  const requiredSymbols = findRequiredSymbols(expression.parsedValue);
  const allDefinedVariables = [...Object.keys(values), ...symbol.parsedValue.arguments];
  const undefinedVariables = requiredSymbols.variables.filter(
    (requiredSymbol) => !allDefinedVariables.includes(requiredSymbol)
  );
  if (undefinedVariables.length > 0) {
    return {
      message: `Missing value for symbols: ${undefinedVariables.join(', ')}`,
      start: expression.startIndex,
      end: null,
    };
  }

  const allDefinedFunctions = Object.keys(functions);
  const undefinedFunctions = requiredSymbols.functions.filter(
    (requiredSymbol) => !allDefinedFunctions.includes(requiredSymbol)
  );

  if (undefinedFunctions.length > 0) {
    return {
      message: `Missing functions: ${undefinedFunctions.join(', ')}`,
      start: expression.startIndex,
      end: null,
    };
  }

  return null;
};

export default checkFunctionForUndefinedSymbols;
