import tokens from '../../tokens';
import { ParserError } from '../../errors';
import validateTokensList from '../validateTokensList';

describe('validateTokensList', () => {
  it('should work as identity function when tokens list is valid', () => {
    // given
    const tokensList = [
      { type: tokens.SYMBOL, value: 'a' },
      { type: tokens.OPERATOR, value: '*' },
      {
        type: tokens.FUNCTION,
        name: 'foo',
        arguments: [
          [
            { type: tokens.SYMBOL, value: '6' },
            { type: tokens.OPERATOR, value: '*' },
            { type: tokens.SYMBOL, value: '9' },
          ]
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
    // given
    const tokensList = [
      { type: tokens.OPERATOR, value: '*' },
      { type: tokens.SYMBOL, value: '5' },
    ];

    // when
    const testFunction = () => validateTokensList(tokensList);

    // then
    expect(testFunction).toThrowError(new ParserError('Encountered leading "*" operator'));
  });

  it('should throw an error when there is a trailing binary operator', () => {
    // given
    const tokensList = [
      { type: tokens.SYMBOL, value: '5' },
      { type: tokens.OPERATOR, value: '*' },
    ];

    // when
    const testFunction = () => validateTokensList(tokensList);

    // then
    expect(testFunction).toThrowError(new ParserError('Encountered trailing "*" operator'));
  });

  it('should throw an error when there are adjacent operators', () => {
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
    expect(testFunction).toThrowError(new ParserError('Encountered two adjacent operators'));
  });

  it('should throw an error when there is a subexpression adjacent to symbol', () => {
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
      new ParserError('Expected an operator but encountered "3" instead')
    );
  });

  it('should throw an error when there are two adjacent subexpressions', () => {
    // given
    const tokensList = [
      {
        type: tokens.SUBEXPRESSION,
        value: [{ type: tokens.SYMBOL, value: '1' }],
      },
      {
        type: tokens.SUBEXPRESSION,
        value: [
          { type: tokens.SYMBOL, value: '2' },
          { type: tokens.OPERATOR, value: '*' },
          { type: tokens.SYMBOL, value: '3' },
        ],
      },
    ];

    // when
    const testFunction = () => validateTokensList(tokensList);

    // then
    expect(testFunction).toThrowError(
      new ParserError('Expected an operator but encountered subexpression instead')
    );
  });

  it('should throw an error when there a function adjacent to subexpression', () => {
    // given
    const tokensList = [
      {
        type: tokens.SUBEXPRESSION,
        value: [{ type: tokens.SYMBOL, value: '1' }],
      },
      {
        type: tokens.FUNCTION,
        name: 'sin',
        arguments: [
          [
            { type: tokens.SYMBOL, value: '2' },
            { type: tokens.OPERATOR, value: '*' },
            { type: tokens.SYMBOL, value: '3' },
          ],
        ],
      },
    ];

    // when
    const testFunction = () => validateTokensList(tokensList);

    // then
    expect(testFunction).toThrowError(
      new ParserError('Expected an operator but encountered function instead')
    );
  });

  it('should throw an error when there is an error in subexpression', () => {
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
    expect(testFunction).toThrow(ParserError);
  });

  it('should throw an error when there is an error in function', () => {
    // given
    const tokensList = [
      { type: tokens.SYMBOL, value: '3' },
      { type: tokens.OPERATOR, value: '+' },
      {
        type: tokens.FUNCTION,
        name: 'foo',
        arguments: [
          [{ type: tokens.OPERATOR, value: '*' }],
        ],
      },
    ];

    // when
    const testFunction = () => validateTokensList(tokensList);

    // then
    expect(testFunction).toThrow(ParserError);
  });
});
