import tokens from './tokens';

const createAdjacentPairs = (tokensList) => {
  const { pairs, previousToken: lastToken } = tokensList.reduce(
    ({ pairs, previousToken }, currentToken) => {
      return {
        pairs: [...pairs, [previousToken, currentToken]],
        previousToken: currentToken,
      };
    },
    { pairs: [], previousToken: null }
  );
  return [...pairs, [lastToken, null]];
};

const validateTokensList = (tokensList) => {
  tokensList.forEach((token) => {
    if (token.type === tokens.SUBEXPRESSION) {
      validateTokensList(token.value);
    }
    if (token.type === tokens.FUNCTION) {
      validateTokensList(token.subexpressionContent);
    }
  });

  const adjacentPairs = createAdjacentPairs(tokensList);

  adjacentPairs.forEach(([previousToken, currentToken]) => {
    if (previousToken && !currentToken) {
      if (previousToken.type === tokens.OPERATOR) {
        throw new Error('Encountered trailing binary operator');
      }
    }

    if (currentToken && currentToken.type === tokens.OPERATOR) {
      if (!previousToken && currentToken.value !== '-') {
        throw new Error('Encountered leading binary operator');
      }
      if (previousToken && previousToken.type === tokens.OPERATOR) {
        throw new Error('Encountered two adjacent operators');
      }
    }

    if (currentToken && currentToken.type !== tokens.OPERATOR) {
      if (previousToken && previousToken.type !== tokens.OPERATOR) {
        throw new Error(
          `Expected an operator but encountered ${currentToken.type} instead`
        );
      }
    }
  });

  return tokensList;
};

export default validateTokensList;
