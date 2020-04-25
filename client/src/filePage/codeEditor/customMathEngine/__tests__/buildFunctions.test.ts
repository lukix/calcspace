import tokens from '../tokens';
import buildFunctions from '../buildFunctions';

describe('buildFunctions', () => {
  it('should replace (SYMBOL, SUBEXPRESSION) pair with FUNCTION token', () => {
    // given
    const tokensList = [
      { type: tokens.SYMBOL, value: 'a' },
      { type: tokens.OPERATOR, value: '+' },
      { type: tokens.SYMBOL, value: 'foo' },
      {
        type: tokens.SUBEXPRESSION,
        value: [{ type: tokens.SYMBOL, value: '9' }],
      },
    ];

    // when
    const tokensListWithFunctions = buildFunctions(tokensList);

    // then
    expect(tokensListWithFunctions).toEqual([
      { type: tokens.SYMBOL, value: 'a' },
      { type: tokens.OPERATOR, value: '+' },
      {
        type: tokens.FUNCTION,
        name: 'foo',
        subexpressionContent: [{ type: tokens.SYMBOL, value: '9' }],
      },
    ]);
  });

  it('should build function nested in subexpressions', () => {
    // given
    const tokensList = [
      { type: tokens.SYMBOL, value: 'a' },
      { type: tokens.OPERATOR, value: '+' },
      {
        type: tokens.SUBEXPRESSION,
        value: [
          { type: tokens.SYMBOL, value: 'foo' },
          {
            type: tokens.SUBEXPRESSION,
            value: [{ type: tokens.SYMBOL, value: 'c' }],
          },
        ],
      },
    ];

    // when
    const tokensListWithFunctions = buildFunctions(tokensList);

    // then
    expect(tokensListWithFunctions).toEqual([
      { type: tokens.SYMBOL, value: 'a' },
      { type: tokens.OPERATOR, value: '+' },
      {
        type: tokens.SUBEXPRESSION,
        value: [
          {
            type: tokens.FUNCTION,
            name: 'foo',
            subexpressionContent: [{ type: tokens.SYMBOL, value: 'c' }],
          },
        ],
      },
    ]);
  });

  it('should build function nested in functions', () => {
    // given
    const tokensList = [
      { type: tokens.SYMBOL, value: 'foo' },
      {
        type: tokens.SUBEXPRESSION,
        value: [
          { type: tokens.SYMBOL, value: 'bar' },
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
      { type: tokens.SYMBOL, value: 'a' },
      { type: tokens.OPERATOR, value: '+' },
      {
        type: tokens.SUBEXPRESSION,
        value: [{ type: tokens.SYMBOL, value: '9' }],
      },
    ];

    // when
    const tokensListWithFunctions = buildFunctions(tokensList);

    // then
    expect(tokensListWithFunctions).toEqual(tokensList);
  });
});
