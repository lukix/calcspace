import tokens from '../tokens';
import buildPrecedenceHierarchy from '../buildPrecedenceHierarchy';

describe('buildPrecedenceHierarchy', () => {
  it('should build correct precedence hierarchy', () => {
    // given
    const tokensList = [
      { type: tokens.SYMBOL, value: 'a' },
      { type: tokens.OPERATOR, value: '+' },
      {
        type: tokens.FUNCTION,
        name: 'foo',
        subexpressionContent: [
          { type: tokens.SYMBOL, value: '2' },
          { type: tokens.OPERATOR, value: '*' },
          { type: tokens.SYMBOL, value: 'b' },
        ],
      },
      { type: tokens.OPERATOR, value: '*' },
      { type: tokens.SYMBOL, value: 'c' },
      { type: tokens.OPERATOR, value: '^' },
      { type: tokens.SYMBOL, value: 'd' },
      { type: tokens.OPERATOR, value: '+' },
      { type: tokens.SYMBOL, value: 'e' },
    ];

    // when
    const result = buildPrecedenceHierarchy(tokensList);

    // then
    expect(result).toEqual([
      [[{ type: tokens.SYMBOL, value: 'a' }]],
      [
        [
          {
            type: tokens.FUNCTION,
            name: 'foo',
            subexpressionContent: [
              [
                [{ type: tokens.SYMBOL, value: '2' }],
                [{ type: tokens.SYMBOL, value: 'b' }],
              ],
            ],
          },
        ],
        [
          { type: tokens.SYMBOL, value: 'c' },
          { type: tokens.SYMBOL, value: 'd' },
        ],
      ],
      [[{ type: tokens.SYMBOL, value: 'e' }]],
    ]);
  });

  it('should handle "+" operator', () => {
    // given
    const tokensList = [
      { type: tokens.SYMBOL, value: 'a' },
      { type: tokens.OPERATOR, value: '+' },
      { type: tokens.SYMBOL, value: 'b' },
    ];

    // when
    const result = buildPrecedenceHierarchy(tokensList);

    // then
    expect(result).toEqual([
      [[{ type: tokens.SYMBOL, value: 'a' }]],
      [[{ type: tokens.SYMBOL, value: 'b' }]],
    ]);
  });

  it('should handle "-" operator', () => {
    // given
    const tokensList = [
      { type: tokens.SYMBOL, value: 'a' },
      { type: tokens.OPERATOR, value: '-' },
      { type: tokens.SYMBOL, value: 'b' },
    ];

    // when
    const result = buildPrecedenceHierarchy(tokensList);

    // then
    expect(result).toEqual([
      [[{ type: tokens.SYMBOL, value: 'a' }]],
      [
        [{ type: tokens.SYMBOL, value: '-1' }],
        [{ type: tokens.SYMBOL, value: 'b' }],
      ],
    ]);
  });

  it('should leading "-" operator', () => {
    // given
    const tokensList = [
      { type: tokens.OPERATOR, value: '-' },
      { type: tokens.SYMBOL, value: 'a' },
      { type: tokens.OPERATOR, value: '+' },
      { type: tokens.SYMBOL, value: 'b' },
    ];

    // when
    const result = buildPrecedenceHierarchy(tokensList);

    // then
    expect(result).toEqual([
      [
        [{ type: tokens.SYMBOL, value: '-1' }],
        [{ type: tokens.SYMBOL, value: 'a' }],
      ],
      [[{ type: tokens.SYMBOL, value: 'b' }]],
    ]);
  });

  it('should handle "/" operator', () => {
    // given
    const tokensList = [
      { type: tokens.SYMBOL, value: 'a' },
      { type: tokens.OPERATOR, value: '/' },
      { type: tokens.SYMBOL, value: 'b' },
    ];

    // when
    const result = buildPrecedenceHierarchy(tokensList);

    // then
    expect(result).toEqual([
      [
        [{ type: tokens.SYMBOL, value: 'a' }],
        [
          {
            type: tokens.SUBEXPRESSION,
            value: [[[{ type: tokens.SYMBOL, value: 'b' }]]],
          },
          { type: tokens.SYMBOL, value: '-1' },
        ],
      ],
    ]);
  });

  it('should handle "/" operator with "^" operator', () => {
    // given
    const tokensList = [
      { type: tokens.SYMBOL, value: 'a' },
      { type: tokens.OPERATOR, value: '/' },
      { type: tokens.SYMBOL, value: 'b' },
      { type: tokens.OPERATOR, value: '^' },
      { type: tokens.SYMBOL, value: 'c' },
    ];

    // when
    const result = buildPrecedenceHierarchy(tokensList);

    // then
    expect(result).toEqual([
      [
        [{ type: tokens.SYMBOL, value: 'a' }],
        [
          {
            type: tokens.SUBEXPRESSION,
            value: [
              [
                [
                  { type: tokens.SYMBOL, value: 'b' },
                  { type: tokens.SYMBOL, value: 'c' },
                ],
              ],
            ],
          },
          { type: tokens.SYMBOL, value: '-1' },
        ],
      ],
    ]);
  });
});
