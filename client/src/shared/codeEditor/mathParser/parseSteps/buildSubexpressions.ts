import tokens from '../tokens';
import { ParserError } from '../errors';

const isOpeningParenthesis = (token) => token.type === tokens.OPERATOR && token.value === '(';
const isClosingParenthesis = (token) => token.type === tokens.OPERATOR && token.value === ')';
const isComma = (token) => token.type === tokens.OPERATOR && token.value === ',';

const createSubexpression = (
  value: Array<{ type: string; value: any }>,
  position: number,
  positionEnd: number
) => ({
  type: tokens.SUBEXPRESSION,
  value,
  position,
  positionEnd,
});

const appendToLastSubexpressionInStack = (subexpressionsStack, token) => [
  ...subexpressionsStack.slice(0, -1),
  {
    ...subexpressionsStack[subexpressionsStack.length - 1],
    tokens: [...subexpressionsStack[subexpressionsStack.length - 1].tokens, token],
  },
];

const pushToStack = (stack, value) => [...stack, value];
const removeLastItemFromStack = (stack) => stack.slice(0, -1);
const getLastItemFromStack = (stack) => stack[stack.length - 1];

const buildSubexpressions = (
  primaryTokensList: Array<{ type: string; value: any; position: number }>
): Array<{ type: string; value: any }> => {
  const initialSubexpressionsStack: Array<{
    position: number;
    tokens: Array<{
      type: string;
      value: any;
      position?: number;
    }>;
  }> = [{ tokens: [], position: 0 }];
  let lastToken: { type: string, value: any, position?: number } | null = null;
  const subexpressionsStack = primaryTokensList.reduce((subexpressionsStack, currentToken) => {
    if (lastToken && isClosingParenthesis(lastToken) && isOpeningParenthesis(currentToken)) {
      throw new ParserError('Expected an operator or comma but encountered another parenthesis', {
        start: currentToken.position,
        end: currentToken.position + 1,
      });
    }
    lastToken = currentToken;
    if (isOpeningParenthesis(currentToken)) {
      return pushToStack(subexpressionsStack, { tokens: [], position: currentToken.position });
    }
    if (isClosingParenthesis(currentToken)) {
      if (subexpressionsStack.length <= 1) {
        throw new ParserError('Encountered closing parenthesis without opening one', {
          start: currentToken.position,
          end: currentToken.position + 1,
        });
      }
      const subexpressionToken = createSubexpression(
        getLastItemFromStack(subexpressionsStack).tokens,
        getLastItemFromStack(subexpressionsStack).position,
        currentToken.position + 1
      );
      return appendToLastSubexpressionInStack(
        removeLastItemFromStack(subexpressionsStack),
        subexpressionToken
      );
    }
    if (isComma(currentToken)) {
      if (subexpressionsStack.length <= 1) {
        throw new ParserError('Encountered comma outside of parentheses', {
          start: currentToken.position,
          end: currentToken.position + 1,
        });
      }
      const subexpressionToken = createSubexpression(
        getLastItemFromStack(subexpressionsStack).tokens,
        getLastItemFromStack(subexpressionsStack).position,
        currentToken.position + 1
      );
      return pushToStack(
        appendToLastSubexpressionInStack(
          removeLastItemFromStack(subexpressionsStack),
          subexpressionToken
        ),
        { tokens: [], position: currentToken.position }
      );
    }

    return appendToLastSubexpressionInStack(subexpressionsStack, currentToken);
  }, initialSubexpressionsStack);

  if (subexpressionsStack.length > 1) {
    throw new ParserError('Encountered not closed parenthesis', {
      start: subexpressionsStack[1].position,
    });
  }

  return subexpressionsStack[0].tokens;
};

export default buildSubexpressions;
