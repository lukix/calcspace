import tokens from '../tokens';
import { ParserError } from '../errors';
import parseToPrimaryTokens from '../parseToPrimaryTokens';

describe('parseToPrimaryTokens', () => {
  it('should parse expression into a list of tokens', () => {
    // given
    const expressionString = 'acc + 50 * c - 16 / 2^4';

    // when
    const tokensList = parseToPrimaryTokens(expressionString);

    // then
    expect(tokensList).toEqual([
      { type: tokens.SYMBOL, value: 'acc' },
      { type: tokens.OPERATOR, value: '+' },
      { type: tokens.SYMBOL, value: '50' },
      { type: tokens.OPERATOR, value: '*' },
      { type: tokens.SYMBOL, value: 'c' },
      { type: tokens.OPERATOR, value: '-' },
      { type: tokens.SYMBOL, value: '16' },
      { type: tokens.OPERATOR, value: '/' },
      { type: tokens.SYMBOL, value: '2' },
      { type: tokens.OPERATOR, value: '^' },
      { type: tokens.SYMBOL, value: '4' },
    ]);
  });

  it('should handle underscore characters in symbols', () => {
    // given
    const expressionString = 'a_1 + b_n';

    // when
    const tokensList = parseToPrimaryTokens(expressionString);

    // then
    expect(tokensList).toEqual([
      { type: tokens.SYMBOL, value: 'a_1' },
      { type: tokens.OPERATOR, value: '+' },
      { type: tokens.SYMBOL, value: 'b_n' },
    ]);
  });

  it('should support brackets', () => {
    // given
    const expressionString = 'a * (b + c)';

    // when
    const tokensList = parseToPrimaryTokens(expressionString);

    // then
    expect(tokensList).toEqual([
      { type: tokens.SYMBOL, value: 'a' },
      { type: tokens.OPERATOR, value: '*' },
      { type: tokens.OPERATOR, value: '(' },
      { type: tokens.SYMBOL, value: 'b' },
      { type: tokens.OPERATOR, value: '+' },
      { type: tokens.SYMBOL, value: 'c' },
      { type: tokens.OPERATOR, value: ')' },
    ]);
  });

  it('should support functions', () => {
    // given
    const expressionString = 'sqrt(42.0)';

    // when
    const tokensList = parseToPrimaryTokens(expressionString);

    // then
    expect(tokensList).toEqual([
      { type: tokens.SYMBOL, value: 'sqrt' },
      { type: tokens.OPERATOR, value: '(' },
      { type: tokens.SYMBOL, value: '42.0' },
      { type: tokens.OPERATOR, value: ')' },
    ]);
  });

  it('should throw an error when encountered invalid character', () => {
    // given
    const expressionString = 'abc + @d';

    // when
    const parseFunction = () => parseToPrimaryTokens(expressionString);

    // then
    expect(parseFunction).toThrowError(
      new ParserError('Invalid character `@`')
    );
  });

  it('should throw an error for empty expression', () => {
    // given
    const expressionString = '';

    // when
    const parseFunction = () => parseToPrimaryTokens(expressionString);

    // then
    expect(parseFunction).toThrowError(new ParserError('Empty expression'));
  });
});
