import tokens from './tokens';
import symbolTypes from './symbolTypes';

const buildComplexUnits = (tokensList) => {
  const initialReduceState = {
    tokensList: [],
    currentSymbolWithUnit: null,
    temporaryTokens: [],
  };
  const { tokensList: resultTokens } = [...tokensList, { type: tokens.SPACE }].reduce(
    (acc, currentToken) => {
      if (acc.currentSymbolWithUnit) {
        const previousToken = acc.temporaryTokens[acc.temporaryTokens.length - 1];
        if (
          (currentToken.type === tokens.OPERATOR && ['*', '/', '^'].includes(currentToken.value)) ||
          (currentToken.type === tokens.SYMBOL &&
            currentToken.symbolType === symbolTypes.VARIABLE &&
            !(previousToken?.type === tokens.OPERATOR && previousToken?.value === '^')) ||
          (previousToken?.type === tokens.OPERATOR &&
            previousToken?.value === '^' &&
            currentToken.symbolType === symbolTypes.NUMERIC)
        ) {
          return { ...acc, temporaryTokens: [...acc.temporaryTokens, currentToken] };
        }

        const lastSymbolIndex = acc.temporaryTokens
          .map(({ type }) => type)
          .lastIndexOf(tokens.SYMBOL);
        const unitTokens = acc.temporaryTokens.slice(0, lastSymbolIndex + 1);
        const notUnitTokens = acc.temporaryTokens.slice(lastSymbolIndex + 1);
        return {
          ...acc,
          tokensList: [
            ...acc.tokensList,
            {
              ...acc.currentSymbolWithUnit,
              value: [acc.currentSymbolWithUnit, ...unitTokens].map(({ value }) => value).join(''),
            },
            ...notUnitTokens,
            currentToken,
          ],
          currentSymbolWithUnit: null,
          temporaryTokens: [],
        };
      }
      if (
        currentToken.type === tokens.SYMBOL &&
        currentToken.symbolType === symbolTypes.NUMERIC_WITH_UNIT
      ) {
        return {
          ...acc,
          currentSymbolWithUnit: currentToken,
        };
      }
      return {
        ...acc,
        tokensList: [...acc.tokensList, currentToken],
      };
    },
    initialReduceState
  );
  return resultTokens.slice(0, -1);
};

export default buildComplexUnits;
