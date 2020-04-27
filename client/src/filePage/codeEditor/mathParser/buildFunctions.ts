import tokens from './tokens';

const createFunction = (symbol, subexpression) => ({
  type: tokens.FUNCTION,
  name: symbol.value,
  subexpressionContent: subexpression.value,
});

const buildFunctions = (tokenList) => {
  const tokenListWithResolvedSubexpressions = tokenList.map((token) =>
    token.type === tokens.SUBEXPRESSION
      ? { ...token, value: buildFunctions(token.value) }
      : token
  );

  const initialReduceState = {
    previousToken: null,
    tokensList: [],
  };

  const {
    previousToken: lastToken,
    tokensList,
  } = tokenListWithResolvedSubexpressions.reduce((acc, currentToken) => {
    const hasEncounteredFunction =
      currentToken.type === tokens.SUBEXPRESSION &&
      acc.previousToken?.type === tokens.SYMBOL;
    if (hasEncounteredFunction) {
      const subexpressionToken = {
        ...currentToken,
        value: buildFunctions(currentToken.value),
      };
      return {
        previousToken: null,
        tokensList: [
          ...acc.tokensList,
          createFunction(acc.previousToken, subexpressionToken),
        ],
      };
    }

    return {
      previousToken: currentToken,
      tokensList: acc.previousToken
        ? [...acc.tokensList, acc.previousToken]
        : acc.tokensList,
    };
  }, initialReduceState);

  return lastToken ? [...tokensList, lastToken] : tokensList;
};

export default buildFunctions;
