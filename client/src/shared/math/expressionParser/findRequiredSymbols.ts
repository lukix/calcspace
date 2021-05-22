import tokens from './tokens';
import symbolTypes from './symbolTypes';

const extractSymbols = (element) => {
  if (Array.isArray(element)) {
    return element.flatMap(extractSymbols);
  }
  if (element.type === tokens.SUBEXPRESSION) {
    return extractSymbols(element.value);
  }
  if (element.type === tokens.FUNCTION) {
    return [element, ...element.arguments.flatMap(extractSymbols)];
  }
  if (element.type === tokens.SYMBOL) {
    return [element];
  }
};

const findRequiredSymbols = (parsedExpression) => {
  const symbols = extractSymbols(parsedExpression);

  return {
    variables: symbols
      .filter(
        ({ type, symbolType }) => type === tokens.SYMBOL && symbolType === symbolTypes.VARIABLE
      )
      .map((symbol) => symbol.value),
    functions: symbols.filter(({ type }) => type === tokens.FUNCTION).map((symbol) => symbol.name),
  };
};

export default findRequiredSymbols;
