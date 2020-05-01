import tokenTypes from './tokens';
import { ParserError } from './errors';

const ALLOWED_SYMBOL_CHARS = '.abcdefghijklmnoprstuwqxyz0123456789_'.split('');
const ALLOWED_OPERATOR_CHARS = '+-*/^()'.split('');

const SPACE_CHAR = ' ';

const isValidSymbolChar = (char) =>
  ALLOWED_SYMBOL_CHARS.includes(char.toLocaleLowerCase());
const isValidOperatorChar = (char) =>
  ALLOWED_OPERATOR_CHARS.includes(char.toLocaleLowerCase());

const createSymbol = (value: string) => ({ type: tokenTypes.SYMBOL, value });
const createOperator = (value: string) => ({
  type: tokenTypes.OPERATOR,
  value,
});
const createSpace = () => ({ type: tokenTypes.SPACE });

const eliminateMultipleWhitespaces = (str: string) =>
  str.replace(/\s+/g, SPACE_CHAR);

const parseToPrimaryTokens = (
  expressionString: string
): Array<{ type: string; value?: string }> => {
  const chars = eliminateMultipleWhitespaces(expressionString.trim()).split('');

  if (chars.length === 0) {
    throw new ParserError('Empty expression');
  }
  const initialReducerState: {
    tokens: Array<{ type: string; value?: string }>;
    currentString: string;
  } = { tokens: [], currentString: '' };

  const { tokens, currentString } = chars.reduce((acc, currentChar) => {
    if (currentChar === SPACE_CHAR) {
      const newTokens =
        acc.currentString !== ''
          ? [createSymbol(acc.currentString), createSpace()]
          : [createSpace()];
      return {
        ...acc,
        tokens: [...acc.tokens, ...newTokens],
        currentString: '',
      };
    }
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
    throw new ParserError(`Invalid character \`${currentChar}\``);
  }, initialReducerState);

  return currentString === ''
    ? tokens
    : [...tokens, createSymbol(currentString)];
};

export default parseToPrimaryTokens;
