import tokens from '../../tokens';
import symbolTypes from '../../symbolTypes';
import buildPrecedenceHierarchy from '../buildPrecedenceHierarchy';

describe('buildPrecedenceHierarchy', () => {
  it('should build correct precedence hierarchy', () => {
    // given
    const tokensList = [
      { type: tokens.SYMBOL, value: 'a', symbolType: symbolTypes.VARIABLE },
      { type: tokens.OPERATOR, value: '+' },
      {
        type: tokens.FUNCTION,
        name: 'foo',
        arguments: [
          [
            { type: tokens.SYMBOL, value: '2', symbolType: symbolTypes.NUMERIC, number: 2 },
            { type: tokens.OPERATOR, value: '*' },
            { type: tokens.SYMBOL, value: 'b', symbolType: symbolTypes.VARIABLE },
          ],
        ],
      },
      { type: tokens.OPERATOR, value: '*' },
      { type: tokens.SYMBOL, value: 'c', symbolType: symbolTypes.VARIABLE },
      { type: tokens.OPERATOR, value: '^' },
      { type: tokens.SYMBOL, value: 'd', symbolType: symbolTypes.VARIABLE },
      { type: tokens.OPERATOR, value: '+' },
      { type: tokens.SYMBOL, value: 'e', symbolType: symbolTypes.VARIABLE },
    ];

    // when
    const result = buildPrecedenceHierarchy(tokensList);

    // then
    expect(result).toEqual([
      [[{ type: tokens.SYMBOL, value: 'a', symbolType: symbolTypes.VARIABLE }]],
      [
        [
          {
            type: tokens.FUNCTION,
            name: 'foo',
            arguments: [
              [
                [
                  [{ type: tokens.SYMBOL, value: '2', symbolType: symbolTypes.NUMERIC, number: 2 }],
                  [{ type: tokens.SYMBOL, value: 'b', symbolType: symbolTypes.VARIABLE }],
                ],
              ],
            ],
          },
        ],
        [
          { type: tokens.SYMBOL, value: 'c', symbolType: symbolTypes.VARIABLE },
          { type: tokens.SYMBOL, value: 'd', symbolType: symbolTypes.VARIABLE },
        ],
      ],
      [[{ type: tokens.SYMBOL, value: 'e', symbolType: symbolTypes.VARIABLE }]],
    ]);
  });

  it('should handle "+" operator', () => {
    // given
    const tokensList = [
      { type: tokens.SYMBOL, value: 'a', symbolType: symbolTypes.VARIABLE },
      { type: tokens.OPERATOR, value: '+' },
      { type: tokens.SYMBOL, value: 'b', symbolType: symbolTypes.VARIABLE },
    ];

    // when
    const result = buildPrecedenceHierarchy(tokensList);

    // then
    expect(result).toEqual([
      [[{ type: tokens.SYMBOL, value: 'a', symbolType: symbolTypes.VARIABLE }]],
      [[{ type: tokens.SYMBOL, value: 'b', symbolType: symbolTypes.VARIABLE }]],
    ]);
  });

  it('should handle "-" operator', () => {
    // given
    const tokensList = [
      { type: tokens.SYMBOL, value: 'a', symbolType: symbolTypes.VARIABLE },
      { type: tokens.OPERATOR, value: '-' },
      { type: tokens.SYMBOL, value: 'b', symbolType: symbolTypes.VARIABLE },
    ];

    // when
    const result = buildPrecedenceHierarchy(tokensList);

    // then
    expect(result).toEqual([
      [[{ type: tokens.SYMBOL, value: 'a', symbolType: symbolTypes.VARIABLE }]],
      [
        [{ type: tokens.SYMBOL, value: '-1', symbolType: symbolTypes.NUMERIC, number: -1 }],
        [{ type: tokens.SYMBOL, value: 'b', symbolType: symbolTypes.VARIABLE }],
      ],
    ]);
  });

  it('should leading "-" operator', () => {
    // given
    const tokensList = [
      { type: tokens.OPERATOR, value: '-' },
      { type: tokens.SYMBOL, value: 'a', symbolType: symbolTypes.VARIABLE },
      { type: tokens.OPERATOR, value: '+' },
      { type: tokens.SYMBOL, value: 'b', symbolType: symbolTypes.VARIABLE },
    ];

    // when
    const result = buildPrecedenceHierarchy(tokensList);

    // then
    expect(result).toEqual([
      [
        [{ type: tokens.SYMBOL, value: '-1', symbolType: symbolTypes.NUMERIC, number: -1 }],
        [{ type: tokens.SYMBOL, value: 'a', symbolType: symbolTypes.VARIABLE }],
      ],
      [[{ type: tokens.SYMBOL, value: 'b', symbolType: symbolTypes.VARIABLE }]],
    ]);
  });

  it('should handle "/" operator', () => {
    // given
    const tokensList = [
      { type: tokens.SYMBOL, value: 'a', symbolType: symbolTypes.VARIABLE },
      { type: tokens.OPERATOR, value: '/' },
      { type: tokens.SYMBOL, value: 'b', symbolType: symbolTypes.VARIABLE },
    ];

    // when
    const result = buildPrecedenceHierarchy(tokensList);

    // then
    expect(result).toEqual([
      [
        [{ type: tokens.SYMBOL, value: 'a', symbolType: symbolTypes.VARIABLE }],
        [
          {
            type: tokens.SUBEXPRESSION,
            value: [[[{ type: tokens.SYMBOL, value: 'b', symbolType: symbolTypes.VARIABLE }]]],
          },
          { type: tokens.SYMBOL, value: '-1', symbolType: symbolTypes.NUMERIC, number: -1 },
        ],
      ],
    ]);
  });

  it('should handle "/" operator with "^" operator', () => {
    // given
    const tokensList = [
      { type: tokens.SYMBOL, value: 'a', symbolType: symbolTypes.VARIABLE },
      { type: tokens.OPERATOR, value: '/' },
      { type: tokens.SYMBOL, value: 'b', symbolType: symbolTypes.VARIABLE },
      { type: tokens.OPERATOR, value: '^' },
      { type: tokens.SYMBOL, value: 'c', symbolType: symbolTypes.VARIABLE },
    ];

    // when
    const result = buildPrecedenceHierarchy(tokensList);

    // then
    expect(result).toEqual([
      [
        [{ type: tokens.SYMBOL, value: 'a', symbolType: symbolTypes.VARIABLE }],
        [
          {
            type: tokens.SUBEXPRESSION,
            value: [
              [
                [
                  { type: tokens.SYMBOL, value: 'b', symbolType: symbolTypes.VARIABLE },
                  { type: tokens.SYMBOL, value: 'c', symbolType: symbolTypes.VARIABLE },
                ],
              ],
            ],
          },
          { type: tokens.SYMBOL, value: '-1', symbolType: symbolTypes.NUMERIC, number: -1 },
        ],
      ],
    ]);
  });

  it('should handle "/" operator followed by subexpression', () => {
    // given
    const tokensList = [
      { type: tokens.SYMBOL, value: '2', symbolType: symbolTypes.NUMERIC },
      { type: tokens.OPERATOR, value: '/' },
      {
        type: tokens.SUBEXPRESSION,
        value: [{ type: tokens.SYMBOL, value: '3', symbolType: symbolTypes.NUMERIC }],
      },
    ];

    // when
    const result = buildPrecedenceHierarchy(tokensList);

    // then
    expect(result).toEqual([
      [
        [{ type: tokens.SYMBOL, value: '2', symbolType: symbolTypes.NUMERIC }],
        [
          {
            type: tokens.SUBEXPRESSION,
            value: [
              [
                [
                  {
                    type: tokens.SUBEXPRESSION,
                    value: [
                      [[{ type: tokens.SYMBOL, value: '3', symbolType: symbolTypes.NUMERIC }]],
                    ],
                  },
                ],
              ],
            ],
          },
          { type: tokens.SYMBOL, value: '-1', symbolType: symbolTypes.NUMERIC, number: -1 },
        ],
      ],
    ]);
  });
});
