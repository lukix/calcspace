import tokens from '../tokens';
import ParserError from '../ParserError';
import buildSubexpressions from '../buildSubexpressions';

describe('buildSubexpressions', () => {
  it('should build subexpressions from primary tokens list', () => {
    // given
    const primaryTokensList = [
      { type: tokens.SYMBOL, value: 'a' },
      { type: tokens.OPERATOR, value: '*' },
      { type: tokens.OPERATOR, value: '(' },
      { type: tokens.SYMBOL, value: 'b' },
      { type: tokens.OPERATOR, value: '+' },
      { type: tokens.SYMBOL, value: 'c' },
      { type: tokens.OPERATOR, value: ')' },
    ];

    // when
    const tokensListWithSubexpressions = buildSubexpressions(primaryTokensList);

    // then
    expect(tokensListWithSubexpressions).toEqual([
      { type: tokens.SYMBOL, value: 'a' },
      { type: tokens.OPERATOR, value: '*' },
      {
        type: tokens.SUBEXPRESSION,
        value: [
          { type: tokens.SYMBOL, value: 'b' },
          { type: tokens.OPERATOR, value: '+' },
          { type: tokens.SYMBOL, value: 'c' },
        ],
      },
    ]);
  });

  it('should support nested subexpressions', () => {
    // given
    const primaryTokensList = [
      { type: tokens.OPERATOR, value: '(' },
      { type: tokens.SYMBOL, value: 'a' },
      { type: tokens.OPERATOR, value: '/' },
      { type: tokens.OPERATOR, value: '(' },
      { type: tokens.SYMBOL, value: 'b' },
      { type: tokens.OPERATOR, value: '-' },
      { type: tokens.SYMBOL, value: 'c' },
      { type: tokens.OPERATOR, value: ')' },
      { type: tokens.OPERATOR, value: ')' },
      { type: tokens.OPERATOR, value: '*' },
      { type: tokens.SYMBOL, value: 'd' },
    ];

    // when
    const tokensListWithSubexpressions = buildSubexpressions(primaryTokensList);

    // then
    expect(tokensListWithSubexpressions).toEqual([
      {
        type: tokens.SUBEXPRESSION,
        value: [
          { type: tokens.SYMBOL, value: 'a' },
          { type: tokens.OPERATOR, value: '/' },
          {
            type: tokens.SUBEXPRESSION,
            value: [
              { type: tokens.SYMBOL, value: 'b' },
              { type: tokens.OPERATOR, value: '-' },
              { type: tokens.SYMBOL, value: 'c' },
            ],
          },
        ],
      },
      { type: tokens.OPERATOR, value: '*' },
      { type: tokens.SYMBOL, value: 'd' },
    ]);
  });

  it('should return input when there are no expressions', () => {
    // given
    const primaryTokensList = [
      { type: tokens.SYMBOL, value: 'a' },
      { type: tokens.OPERATOR, value: '^' },
      { type: tokens.SYMBOL, value: 'b' },
    ];

    // when
    const tokensListWithSubexpressions = buildSubexpressions(primaryTokensList);

    // then
    expect(tokensListWithSubexpressions).toEqual(primaryTokensList);
  });

  it('should throw an error when there are not closed parentheses', () => {
    // given
    const primaryTokensList = [
      { type: tokens.OPERATOR, value: '(' },
      { type: tokens.SYMBOL, value: '5' },
      { type: tokens.OPERATOR, value: '+' },
      { type: tokens.SYMBOL, value: '4' },
    ];

    // when
    const testFunction = () => buildSubexpressions(primaryTokensList);

    // then
    expect(testFunction).toThrowError(
      new ParserError('Encountered not closed parenthesis')
    );
  });

  it('should throw an error when there is a closing parenthesis without opening one', () => {
    // given
    const primaryTokensList = [
      { type: tokens.OPERATOR, value: ')' },
      { type: tokens.SYMBOL, value: '5' },
      { type: tokens.OPERATOR, value: '+' },
      { type: tokens.SYMBOL, value: '4' },
    ];

    // when
    const testFunction = () => buildSubexpressions(primaryTokensList);

    // then
    expect(testFunction).toThrowError(
      new ParserError('Encountered closing parenthesis without opening one')
    );
  });
});
