import tokens from '../../tokens';
import { ParserError } from '../../errors';
import parseToPrimaryTokens from '../parseToPrimaryTokens';

describe('parseToPrimaryTokens', () => {
  it('should parse expression into a list of tokens', () => {
    // given
    const expressionString = 'acc+50*c-16/2^4';

    // when
    const tokensList = parseToPrimaryTokens(expressionString);

    // then
    expect(tokensList).toEqual([
      { type: tokens.SYMBOL, value: 'acc', position: 0 },
      { type: tokens.OPERATOR, value: '+', position: 3 },
      { type: tokens.SYMBOL, value: '50', position: 4 },
      { type: tokens.OPERATOR, value: '*', position: 6 },
      { type: tokens.SYMBOL, value: 'c', position: 7 },
      { type: tokens.OPERATOR, value: '-', position: 8 },
      { type: tokens.SYMBOL, value: '16', position: 9 },
      { type: tokens.OPERATOR, value: '/', position: 11 },
      { type: tokens.SYMBOL, value: '2', position: 12 },
      { type: tokens.OPERATOR, value: '^', position: 13 },
      { type: tokens.SYMBOL, value: '4', position: 14 },
    ]);
  });

  it('should handle underscore characters in symbols', () => {
    // given
    const expressionString = 'a_1+b_n';

    // when
    const tokensList = parseToPrimaryTokens(expressionString);

    // then
    expect(tokensList).toEqual([
      { type: tokens.SYMBOL, value: 'a_1', position: 0 },
      { type: tokens.OPERATOR, value: '+', position: 3 },
      { type: tokens.SYMBOL, value: 'b_n', position: 4 },
    ]);
  });

  it('should support brackets', () => {
    // given
    const expressionString = 'a*(b+c)';

    // when
    const tokensList = parseToPrimaryTokens(expressionString);

    // then
    expect(tokensList).toEqual([
      { type: tokens.SYMBOL, value: 'a', position: 0 },
      { type: tokens.OPERATOR, value: '*', position: 1 },
      { type: tokens.OPERATOR, value: '(', position: 2 },
      { type: tokens.SYMBOL, value: 'b', position: 3 },
      { type: tokens.OPERATOR, value: '+', position: 4 },
      { type: tokens.SYMBOL, value: 'c', position: 5 },
      { type: tokens.OPERATOR, value: ')', position: 6 },
    ]);
  });

  it('should support functions', () => {
    // given
    const expressionString = 'sqrt(42.0)';

    // when
    const tokensList = parseToPrimaryTokens(expressionString);

    // then
    expect(tokensList).toEqual([
      { type: tokens.SYMBOL, value: 'sqrt', position: 0 },
      { type: tokens.OPERATOR, value: '(', position: 4 },
      { type: tokens.SYMBOL, value: '42.0', position: 5 },
      { type: tokens.OPERATOR, value: ')', position: 9 },
    ]);
  });

  it('should throw an error when encountered invalid character', () => {
    // given
    const expressionString = 'abc+@d';

    // when
    const parseFunction = () => parseToPrimaryTokens(expressionString);

    // then
    expect(parseFunction).toThrowError(new ParserError('Invalid character `@`'));
  });

  it('should ignore leading and trailing spaces', () => {
    // given
    const expressionString = ' 5+4+3  ';

    // when
    const tokensList = parseToPrimaryTokens(expressionString);

    // then
    expect(tokensList).toEqual([
      { type: tokens.SYMBOL, value: '5', position: 1 },
      { type: tokens.OPERATOR, value: '+', position: 2 },
      { type: tokens.SYMBOL, value: '4', position: 3 },
      { type: tokens.OPERATOR, value: '+', position: 4 },
      { type: tokens.SYMBOL, value: '3', position: 5 },
    ]);
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
