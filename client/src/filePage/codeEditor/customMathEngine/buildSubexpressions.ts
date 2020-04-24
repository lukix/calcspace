import tokens from './tokens';

const isOpeningParenthesis = (token) =>
  token.type === tokens.OPERATOR && token.value === '(';
const isClosingParenthesis = (token) =>
  token.type === tokens.OPERATOR && token.value === ')';

const createSubexpression = (value: Array<{ type: string; value: any }>) => ({
  type: tokens.SUBEXPRESSION,
  value,
});

const appendToLastSubexpressionInStack = (subexpressionsStack, token) => [
  ...subexpressionsStack.slice(0, -1),
  [...subexpressionsStack[subexpressionsStack.length - 1], token],
];

const pushToStack = (stack, value) => [...stack, value];
const removeLastItemFromStack = (stack) => stack.slice(0, -1);
const getLastItemFromStack = (stack) => stack[stack.length - 1];

const buildSubexpressions = (
  primaryTokensList: Array<{ type: string; value: any }>
): Array<{ type: string; value: any }> => {
  const initialSubexpressionsStack: Array<Array<{
    type: string;
    value: any;
  }>> = [[]];
  const subexpressionsStack = primaryTokensList.reduce(
    (subexpressionsStack, currentToken) => {
      if (isOpeningParenthesis(currentToken)) {
        return pushToStack(subexpressionsStack, []);
      }
      if (isClosingParenthesis(currentToken)) {
        if (subexpressionsStack.length <= 1) {
          throw new Error(
            'Encountered closing parenthesis without opening one'
          );
        }
        const subexpressionToken = createSubexpression(
          getLastItemFromStack(subexpressionsStack)
        );
        return appendToLastSubexpressionInStack(
          removeLastItemFromStack(subexpressionsStack),
          subexpressionToken
        );
      }

      return appendToLastSubexpressionInStack(
        subexpressionsStack,
        currentToken
      );
    },
    initialSubexpressionsStack
  );

  if (subexpressionsStack.length > 1) {
    throw new Error('Encountered not closed parenthesis');
  }

  return subexpressionsStack[0];
};

export default buildSubexpressions;
