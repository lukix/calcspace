import tokens from '../tokens';
import symbolTypes from '../symbolTypes';
import { ParserError } from '../errors';

const createFunction = (symbol, subexpressions, position, positionEnd) => ({
  type: tokens.FUNCTION,
  name: symbol.value,
  arguments: subexpressions.map(({ value }) => value),
  position,
  positionEnd,
});

const buildFunctions = (tokenList) => {
  const tokenListWithResolvedSubexpressions = tokenList.map((token) =>
    token.type === tokens.SUBEXPRESSION ? { ...token, value: buildFunctions(token.value) } : token
  );

  const initialReduceState = {
    previousToken: null,
    currentFunction: null,
    currentFunctionArguments: [],
    tokensList: [],
  };

  const {
    previousToken: lastToken,
    currentFunction: lastFunction,
    currentFunctionArguments: lastFunctionArguments,
    tokensList,
  } = tokenListWithResolvedSubexpressions.reduce(
    (acc, currentToken, index) => {
      const hasEncounteredFunction =
        currentToken.type === tokens.SUBEXPRESSION && acc.previousToken?.type === tokens.SYMBOL;
      if (hasEncounteredFunction) {
        if (acc.previousToken.symbolType !== symbolTypes.VARIABLE) {
          throw new ParserError(`"${acc.previousToken.value}" is not a valid function name`, {
            start: acc.previousToken.position,
            end: acc.previousToken.position + acc.previousToken.value.length,
          });
        }

        return {
          previousToken: currentToken,
          currentFunction: {
            token: acc.previousToken,
            position: acc.previousToken.position,
          },
          currentFunctionArguments: [
            ...acc.currentFunctionArguments,
            {
              ...currentToken,
              value: buildFunctions(currentToken.value),
            },
          ],
          tokensList: acc.tokensList,
        };
      }

      const hasEncounteredNextArgument = currentToken.type === tokens.SUBEXPRESSION && acc.currentFunction;
      if (hasEncounteredNextArgument) {
        return {
          previousToken: currentToken,
          currentFunction: acc.currentFunction,
          currentFunctionArguments: [
            ...acc.currentFunctionArguments,
            {
              ...currentToken,
              value: buildFunctions(currentToken.value),
            },
          ],
          tokensList: acc.tokensList,
        };
      }

      const hasEncounteredEndOfFunction = (
        currentToken.type !== tokens.SUBEXPRESSION || index + 1 === tokenList.length
      ) && acc.currentFunction;
      if (hasEncounteredEndOfFunction) {
        return {
          previousToken: currentToken,
          currentFunction: null,
          currentFunctionArguments: [],
          tokensList: [
            ...acc.tokensList,
            createFunction(
              acc.currentFunction.token,
              acc.currentFunctionArguments,
              acc.currentFunction.position,
              acc.previousToken.positionEnd
            ),
          ],
        };
      }

      if (currentToken.type === tokens.SUBEXPRESSION && acc.previousToken?.type === tokens.SUBEXPRESSION) {
        throw new ParserError(`Encountered a list outside of function arguments`, {
          start: acc.previousToken.position,
          end: currentToken.position + currentToken.value.length,
        });
      }

      return {
        ...acc,
        previousToken: currentToken,
        tokensList: acc.previousToken ? [...acc.tokensList, acc.previousToken] : acc.tokensList,
      };
    },
    initialReduceState
  );

  return [
    ...tokensList,
    ...(lastFunction ? [
      createFunction(
        lastFunction.token,
        lastFunctionArguments,
        lastFunction.position,
        lastToken.positionEnd,
      ),
    ] : []),
    ...(lastToken && !lastFunction ? [lastToken] : []),
  ];
};

export default buildFunctions;
