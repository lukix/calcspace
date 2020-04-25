import tokens from './tokens';

const allowedSymbolChars = '.abcdefghijklmnoprstuwqxyz0123456789_'.split('');
const allowedOperatorChars = '+-*/^()'.split('');

const isValidSymbolChar = (char) =>
  allowedSymbolChars.includes(char.toLocaleLowerCase());
const isValidOperatorChar = (char) =>
  allowedOperatorChars.includes(char.toLocaleLowerCase());

const createSymbol = (value: string) => ({ type: tokens.SYMBOL, value });
const createOperator = (value: string) => ({ type: tokens.OPERATOR, value });

const removeWhitespaces = (str: string) => str.replace(/\s/g, '');

const parseToPrimaryTokens = (
  expressionString: string
): Array<{ type: string; value: string }> => {
  const chars = removeWhitespaces(expressionString).split('');

  const initialReducerState: {
    tokens: Array<{ type: string; value: string }>;
    currentString: string;
  } = { tokens: [], currentString: '' };

  const { tokens, currentString } = chars.reduce((acc, currentChar) => {
    if (isValidSymbolChar(currentChar)) {
      return { ...acc, currentString: acc.currentString + currentChar };
    }
    if (isValidOperatorChar(currentChar)) {
      const newTokens =
        acc.currentString !== ''
          ? [createSymbol(acc.currentString), createOperator(currentChar)]
          : [createOperator(currentChar)];
      return {
        ...acc,
        tokens: [...acc.tokens, ...newTokens],
        currentString: '',
      };
    }
    throw new Error(`Invalid character \`${currentChar}\``);
  }, initialReducerState);

  return currentString === ''
    ? tokens
    : [...tokens, createSymbol(currentString)];
};

export default parseToPrimaryTokens;
