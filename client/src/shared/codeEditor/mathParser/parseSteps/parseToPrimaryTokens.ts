import tokenTypes from '../tokens';
import { ParserError } from '../errors';

const ALLOWED_SYMBOL_CHARS = '.abcdefghijklmnoprstuwvqxyz0123456789_'.split('');
const ALLOWED_OPERATOR_CHARS = ',+-*/^()'.split('');
const SPACE_CHAR = ' ';

const isValidSymbolChar = (char) => ALLOWED_SYMBOL_CHARS.includes(char.toLocaleLowerCase());
const isValidOperatorChar = (char) => ALLOWED_OPERATOR_CHARS.includes(char.toLocaleLowerCase());

const createSymbol = (value: string, position: number) => ({
  type: tokenTypes.SYMBOL,
  value,
  position,
  positionEnd: position + value.length,
});
const createOperator = (value: string, position: number) => ({
  type: tokenTypes.OPERATOR,
  value,
  position,
  positionEnd: position + value.length,
});
const createSpace = () => ({ type: tokenTypes.SPACE });

const replaceWhitespacesWithSpaces = (str: string) => str.replace(/\s/g, SPACE_CHAR);

const parseToPrimaryTokens = (
  expressionString: string
): Array<{ type: string; value?: string }> => {
  const chars = replaceWhitespacesWithSpaces(expressionString.trim()).split('');
  const charsTrimmedFromStart = expressionString.length - expressionString.trimStart().length;

  if (chars.length === 0) {
    throw new ParserError('Empty expression');
  }
  const initialReducerState: {
    tokens: Array<{ type: string; value?: string }>;
    currentString: string;
  } = { tokens: [], currentString: '' };

  const { tokens, currentString } = chars.reduce((acc, currentChar, relativeIndex) => {
    const index = charsTrimmedFromStart + relativeIndex;
    if (currentChar === SPACE_CHAR) {
      const newTokens =
        acc.currentString !== ''
          ? [createSymbol(acc.currentString, index - acc.currentString.length), createSpace()]
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
          ? [
              createSymbol(acc.currentString, index - acc.currentString.length),
              createOperator(currentChar, index),
            ]
          : [createOperator(currentChar, index)];
      return {
        ...acc,
        tokens: [...acc.tokens, ...newTokens],
        currentString: '',
      };
    }
    throw new ParserError(`Invalid character \`${currentChar}\``, { start: index, end: index + 1 });
  }, initialReducerState);

  return currentString === ''
    ? tokens
    : [
        ...tokens,
        createSymbol(currentString, charsTrimmedFromStart + chars.length - currentString.length),
      ];
};

export default parseToPrimaryTokens;
