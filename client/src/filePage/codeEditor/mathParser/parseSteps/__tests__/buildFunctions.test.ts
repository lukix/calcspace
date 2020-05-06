import tokens from '../../tokens';
import symbolTypes from '../../symbolTypes';
import buildFunctions from '../buildFunctions';
import { ParserError } from '../../errors';

describe('buildFunctions', () => {
  it('should replace (VARIABLE SYMBOL, SUBEXPRESSION) pair with FUNCTION token', () => {
    // given
    const tokensList = [
      { type: tokens.SYMBOL, value: 'a', symbolType: symbolTypes.VARIABLE },
      { type: tokens.OPERATOR, value: '+' },
      { type: tokens.SYMBOL, value: 'foo', symbolType: symbolTypes.VARIABLE },
      {
        type: tokens.SUBEXPRESSION,
        value: [{ type: tokens.SYMBOL, value: '9', symbolType: symbolTypes.NUMERIC }],
      },
    ];

    // when
    const tokensListWithFunctions = buildFunctions(tokensList);

    // then
    expect(tokensListWithFunctions).toEqual([
      { type: tokens.SYMBOL, value: 'a', symbolType: symbolTypes.VARIABLE },
      { type: tokens.OPERATOR, value: '+' },
      {
        type: tokens.FUNCTION,
        name: 'foo',
        subexpressionContent: [
          { type: tokens.SYMBOL, value: '9', symbolType: symbolTypes.NUMERIC },
        ],
      },
    ]);
  });

  it('should build function nested in subexpressions', () => {
    // given
    const tokensList = [
      { type: tokens.SYMBOL, value: 'a', symbolType: symbolTypes.VARIABLE },
      { type: tokens.OPERATOR, value: '+' },
      {
        type: tokens.SUBEXPRESSION,
        value: [
          {
            type: tokens.SYMBOL,
            value: 'foo',
            symbolType: symbolTypes.VARIABLE,
          },
          {
            type: tokens.SUBEXPRESSION,
            value: [
              {
                type: tokens.SYMBOL,
                value: 'c',
                symbolType: symbolTypes.VARIABLE,
              },
            ],
          },
        ],
      },
    ];

    // when
    const tokensListWithFunctions = buildFunctions(tokensList);

    // then
    expect(tokensListWithFunctions).toEqual([
      { type: tokens.SYMBOL, value: 'a', symbolType: symbolTypes.VARIABLE },
      { type: tokens.OPERATOR, value: '+' },
      {
        type: tokens.SUBEXPRESSION,
        value: [
          {
            type: tokens.FUNCTION,
            name: 'foo',
            subexpressionContent: [
              {
                type: tokens.SYMBOL,
                value: 'c',
                symbolType: symbolTypes.VARIABLE,
              },
            ],
          },
        ],
      },
    ]);
  });

  it('should build function nested in functions', () => {
    // given
    const tokensList = [
      { type: tokens.SYMBOL, value: 'foo', symbolType: symbolTypes.VARIABLE },
      {
        type: tokens.SUBEXPRESSION,
        value: [
          {
            type: tokens.SYMBOL,
            value: 'bar',
            symbolType: symbolTypes.VARIABLE,
          },
          {
            type: tokens.SUBEXPRESSION,
            value: [],
          },
        ],
      },
    ];

    // when
    const tokensListWithFunctions = buildFunctions(tokensList);

    // then
    expect(tokensListWithFunctions).toEqual([
      {
        type: tokens.FUNCTION,
        name: 'foo',
        subexpressionContent: [
          {
            type: tokens.FUNCTION,
            name: 'bar',
            subexpressionContent: [],
          },
        ],
      },
    ]);
  });

  it('should return unchanged input when there are no functions', () => {
    // given
    const tokensList = [
      { type: tokens.SYMBOL, value: 'a', symbolType: symbolTypes.VARIABLE },
      { type: tokens.OPERATOR, value: '+' },
      {
        type: tokens.SUBEXPRESSION,
        value: [{ type: tokens.SYMBOL, value: '9', symbolType: symbolTypes.NUMERIC }],
      },
    ];

    // when
    const tokensListWithFunctions = buildFunctions(tokensList);

    // then
    expect(tokensListWithFunctions).toEqual(tokensList);
  });

  it('should throw an error for (NUMERIC SYMBOL, SUBEXPRESSION) pair', () => {
    // given
    const tokensList = [
      { type: tokens.SYMBOL, value: 'a', symbolType: symbolTypes.VARIABLE },
      { type: tokens.OPERATOR, value: '+' },
      { type: tokens.SYMBOL, value: '15', symbolType: symbolTypes.NUMERIC },
      {
        type: tokens.SUBEXPRESSION,
        value: [{ type: tokens.SYMBOL, value: '9', symbolType: symbolTypes.NUMERIC }],
      },
    ];

    // when
    const testFunction = () => buildFunctions(tokensList);

    // then
    expect(testFunction).toThrowError(ParserError);
  });

  it('should throw an error for (NUMERIC SYMBOL WITH UNIT, SUBEXPRESSION) pair', () => {
    // given
    const tokensList = [
      { type: tokens.SYMBOL, value: 'a', symbolType: symbolTypes.VARIABLE },
      { type: tokens.OPERATOR, value: '+' },
      {
        type: tokens.SYMBOL,
        value: '15kg',
        symbolType: symbolTypes.NUMERIC_WITH_UNIT,
      },
      {
        type: tokens.SUBEXPRESSION,
        value: [{ type: tokens.SYMBOL, value: '9', symbolType: symbolTypes.NUMERIC }],
      },
    ];

    // when
    const testFunction = () => buildFunctions(tokensList);

    // then
    expect(testFunction).toThrowError(ParserError);
  });
});
