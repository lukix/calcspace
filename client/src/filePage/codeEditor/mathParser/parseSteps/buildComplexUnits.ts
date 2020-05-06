import tokens from '../tokens';
import symbolTypes from '../symbolTypes';

const isOperatorToken = (token, oparatorChars) =>
  token?.type === tokens.OPERATOR && oparatorChars.includes(token?.value);
const isVariableToken = (token) =>
  token?.type === tokens.SYMBOL && token?.symbolType === symbolTypes.VARIABLE;
const isNumberToken = (token) =>
  token?.type === tokens.SYMBOL && token?.symbolType === symbolTypes.NUMERIC;
const isNumberWithUnitToken = (token) =>
  token?.type === tokens.SYMBOL && token?.symbolType === symbolTypes.NUMERIC_WITH_UNIT;

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
          isOperatorToken(currentToken, ['*', '/', '^']) ||
          (!isOperatorToken(previousToken, ['^']) && isVariableToken(currentToken)) ||
          (isOperatorToken(previousToken, ['^', '-']) && isNumberToken(currentToken)) ||
          (isOperatorToken(previousToken, ['^']) && isOperatorToken(currentToken, ['-']))
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
              unit: [acc.currentSymbolWithUnit.unit, ...unitTokens.map(({ value }) => value)].join(
                ''
              ),
            },
            ...notUnitTokens,
            currentToken,
          ],
          currentSymbolWithUnit: null,
          temporaryTokens: [],
        };
      }
      if (isNumberWithUnitToken(currentToken)) {
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
