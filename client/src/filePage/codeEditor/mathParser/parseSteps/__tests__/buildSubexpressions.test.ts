import tokens from '../../tokens';
import { ParserError } from '../../errors';
import buildSubexpressions from '../buildSubexpressions';

describe('buildSubexpressions', () => {
  it('should build subexpressions from primary tokens list', () => {
    // given
    const primaryTokensList = [
      { type: tokens.SYMBOL, value: 'a', position: 0 },
      { type: tokens.OPERATOR, value: '*', position: 1 },
      { type: tokens.OPERATOR, value: '(', position: 2 },
      { type: tokens.SYMBOL, value: 'b', position: 3 },
      { type: tokens.OPERATOR, value: '+', position: 4 },
      { type: tokens.SYMBOL, value: 'c', position: 5 },
      { type: tokens.OPERATOR, value: ')', position: 6 },
    ];

    // when
    const tokensListWithSubexpressions = buildSubexpressions(primaryTokensList);

    // then
    expect(tokensListWithSubexpressions).toEqual([
      { type: tokens.SYMBOL, value: 'a', position: 0 },
      { type: tokens.OPERATOR, value: '*', position: 1 },
      {
        type: tokens.SUBEXPRESSION,
        value: [
          { type: tokens.SYMBOL, value: 'b', position: 3 },
          { type: tokens.OPERATOR, value: '+', position: 4 },
          { type: tokens.SYMBOL, value: 'c', position: 5 },
        ],
        position: 2,
      },
    ]);
  });

  it('should support nested subexpressions', () => {
    // given
    const primaryTokensList = [
      { type: tokens.OPERATOR, value: '(', position: 0 },
      { type: tokens.SYMBOL, value: 'a', position: 1 },
      { type: tokens.OPERATOR, value: '/', position: 2 },
      { type: tokens.OPERATOR, value: '(', position: 3 },
      { type: tokens.SYMBOL, value: 'b', position: 4 },
      { type: tokens.OPERATOR, value: '-', position: 5 },
      { type: tokens.SYMBOL, value: 'c', position: 6 },
      { type: tokens.OPERATOR, value: ')', position: 7 },
      { type: tokens.OPERATOR, value: ')', position: 8 },
      { type: tokens.OPERATOR, value: '*', position: 9 },
      { type: tokens.SYMBOL, value: 'd', position: 10 },
    ];

    // when
    const tokensListWithSubexpressions = buildSubexpressions(primaryTokensList);

    // then
    expect(tokensListWithSubexpressions).toEqual([
      {
        type: tokens.SUBEXPRESSION,
        value: [
          { type: tokens.SYMBOL, value: 'a', position: 1 },
          { type: tokens.OPERATOR, value: '/', position: 2 },
          {
            type: tokens.SUBEXPRESSION,
            value: [
              { type: tokens.SYMBOL, value: 'b', position: 4 },
              { type: tokens.OPERATOR, value: '-', position: 5 },
              { type: tokens.SYMBOL, value: 'c', position: 6 },
            ],
            position: 3,
          },
        ],
        position: 0,
      },
      { type: tokens.OPERATOR, value: '*', position: 9 },
      { type: tokens.SYMBOL, value: 'd', position: 10 },
    ]);
  });

  it('should return input when there are no expressions', () => {
    // given
    const primaryTokensList = [
      { type: tokens.SYMBOL, value: 'a', position: 0 },
      { type: tokens.OPERATOR, value: '^', position: 1 },
      { type: tokens.SYMBOL, value: 'b', position: 2 },
    ];

    // when
    const tokensListWithSubexpressions = buildSubexpressions(primaryTokensList);

    // then
    expect(tokensListWithSubexpressions).toEqual(primaryTokensList);
  });

  it('should throw an error when there are not closed parentheses', () => {
    // given
    const primaryTokensList = [
      { type: tokens.OPERATOR, value: '(', position: 0 },
      { type: tokens.SYMBOL, value: '5', position: 1 },
      { type: tokens.OPERATOR, value: '+', position: 2 },
      { type: tokens.SYMBOL, value: '4', position: 3 },
    ];

    // when
    const testFunction = () => buildSubexpressions(primaryTokensList);

    // then
    expect(testFunction).toThrowError(new ParserError('Encountered not closed parenthesis'));
  });

  it('should throw an error when there is a closing parenthesis without opening one', () => {
    // given
    const primaryTokensList = [
      { type: tokens.OPERATOR, value: ')', position: 0 },
      { type: tokens.SYMBOL, value: '5', position: 1 },
      { type: tokens.OPERATOR, value: '+', position: 2 },
      { type: tokens.SYMBOL, value: '4', position: 3 },
    ];

    // when
    const testFunction = () => buildSubexpressions(primaryTokensList);

    // then
    expect(testFunction).toThrowError(
      new ParserError('Encountered closing parenthesis without opening one')
    );
  });
});
