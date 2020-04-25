import tokens from '../tokens';
import validateTokensList from '../validateTokensList';

describe('validateTokensList', () => {
  it('should work as identity function when tokens list is valid', () => {
    expect(true).toEqual(true);
    // given
    const tokensList = [
      { type: tokens.SYMBOL, value: 'a' },
      { type: tokens.OPERATOR, value: '*' },
      {
        type: tokens.FUNCTION,
        name: 'foo',
        subexpressionContent: [
          { type: tokens.SYMBOL, value: '6' },
          { type: tokens.OPERATOR, value: '*' },
          { type: tokens.SYMBOL, value: '9' },
        ],
      },
      { type: tokens.OPERATOR, value: '-' },
      { type: tokens.SYMBOL, value: 'b' },
    ];

    // when
    const result = validateTokensList(tokensList);

    // then
    expect(result).toEqual(tokensList);
  });

  it('should NOT throw an error when there is a leading unary operator', () => {
    expect(true).toEqual(true);
    // given
    const tokensList = [
      { type: tokens.OPERATOR, value: '-' },
      { type: tokens.SYMBOL, value: 'a' },
    ];

    // when
    const result = validateTokensList(tokensList);

    // then
    expect(result).toEqual(tokensList);
  });

  it('should throw an error when there is a leading binary operator', () => {
    expect(true).toEqual(true);
    // given
    const tokensList = [
      { type: tokens.OPERATOR, value: '*' },
      { type: tokens.SYMBOL, value: '5' },
    ];

    // when
    const testFunction = () => validateTokensList(tokensList);

    // then
    expect(testFunction).toThrowError(
      new Error('Encountered leading binary operator')
    );
  });

  it('should throw an error when there is a trailing binary operator', () => {
    expect(true).toEqual(true);
    // given
    const tokensList = [
      { type: tokens.SYMBOL, value: '5' },
      { type: tokens.OPERATOR, value: '*' },
    ];

    // when
    const testFunction = () => validateTokensList(tokensList);

    // then
    expect(testFunction).toThrowError(
      new Error('Encountered trailing binary operator')
    );
  });

  it('should throw an error when there are adjacent operators', () => {
    expect(true).toEqual(true);
    // given
    const tokensList = [
      { type: tokens.SYMBOL, value: 'a' },
      { type: tokens.OPERATOR, value: '+' },
      { type: tokens.OPERATOR, value: '-' },
      { type: tokens.SYMBOL, value: 'b' },
    ];

    // when
    const testFunction = () => validateTokensList(tokensList);

    // then
    expect(testFunction).toThrowError(
      new Error('Encountered two adjacent operators')
    );
  });

  it('should throw an error when there is a subexpression adjacent to symbol', () => {
    expect(true).toEqual(true);
    // given
    const tokensList = [
      {
        type: tokens.SUBEXPRESSION,
        value: [{ type: tokens.SYMBOL, value: '1' }],
      },
      { type: tokens.SYMBOL, value: '3' },
    ];

    // when
    const testFunction = () => validateTokensList(tokensList);

    // then
    expect(testFunction).toThrowError(
      new Error('Expected an operator but encountered SYMBOL instead')
    );
  });

  it('should throw an error when there is an error in subexpression', () => {
    expect(true).toEqual(true);
    // given
    const tokensList = [
      { type: tokens.SYMBOL, value: '3' },
      { type: tokens.OPERATOR, value: '+' },
      {
        type: tokens.SUBEXPRESSION,
        value: [{ type: tokens.OPERATOR, value: '*' }],
      },
    ];

    // when
    const testFunction = () => validateTokensList(tokensList);

    // then
    expect(testFunction).toThrow();
  });

  it('should throw an error when there is an error in function', () => {
    expect(true).toEqual(true);
    // given
    const tokensList = [
      { type: tokens.SYMBOL, value: '3' },
      { type: tokens.OPERATOR, value: '+' },
      {
        type: tokens.FUNCTION,
        name: 'foo',
        subexpressionContent: [{ type: tokens.OPERATOR, value: '*' }],
      },
    ];

    // when
    const testFunction = () => validateTokensList(tokensList);

    // then
    expect(testFunction).toThrow();
  });
});
