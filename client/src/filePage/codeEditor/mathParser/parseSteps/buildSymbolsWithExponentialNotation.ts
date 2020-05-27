import tokenTypes from '../tokens';
import symbolTypes from '../symbolTypes';

const isNumericSymbol = (token) =>
  token.type === tokenTypes.SYMBOL &&
  [symbolTypes.NUMERIC, symbolTypes.NUMERIC_WITH_UNIT].includes(token.symbolType);
const isMinusOperator = (token) => token.type === tokenTypes.OPERATOR && token.value === '-';
const isSymbolWithExponentialSuffix = (token) =>
  token.type === tokenTypes.SYMBOL &&
  token.symbolType === symbolTypes.NUMERIC_WITH_UNIT &&
  token.unit === 'e';

const buildSymbolsWithExponentialNotation = (tokensList) => {
  return tokensList.reduce((acc, currentToken) => {
    if (
      acc.length >= 2 &&
      isNumericSymbol(currentToken) &&
      isMinusOperator(acc[acc.length - 1]) &&
      isSymbolWithExponentialSuffix(acc[acc.length - 2])
    ) {
      return [
        ...acc.slice(0, -2),
        currentToken.symbolType === symbolTypes.NUMERIC_WITH_UNIT
          ? {
              type: tokenTypes.SYMBOL,
              symbolType: symbolTypes.NUMERIC_WITH_UNIT,
              value: `${acc[acc.length - 2].value}-${currentToken.value}`,
              number: acc[acc.length - 2].number * 10 ** -currentToken.number,
              unit: currentToken.unit,
            }
          : {
              type: tokenTypes.SYMBOL,
              symbolType: symbolTypes.NUMERIC,
              value: `${acc[acc.length - 2].value}-${currentToken.value}`,
              number: acc[acc.length - 2].number * 10 ** -currentToken.number,
            },
      ];
    }
    return [...acc, currentToken];
  }, []);
};

export default buildSymbolsWithExponentialNotation;
