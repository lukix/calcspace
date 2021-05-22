import findRequiredSymbols from '../findRequiredSymbols';
import tokens from '../tokens';
import symbolTypes from '../symbolTypes';

const sort = (arr) => [...arr].sort();

describe('findRequiredSymbols', () => {
  it('should return variables and functions that are used in the expression', () => {
    // given
    const parsedExpression = [
      [[{ type: tokens.SYMBOL, value: 'a', symbolType: symbolTypes.VARIABLE }]],
      [[{ type: tokens.SYMBOL, value: '5', symbolType: symbolTypes.NUMERIC }]],
      [
        [{ type: tokens.SYMBOL, value: 'b', symbolType: symbolTypes.VARIABLE }],
        [{ type: tokens.FUNCTION, name: 'foo', arguments: [] }],
      ],
    ];

    // when
    const requiredSymbols = findRequiredSymbols(parsedExpression);

    // then
    expect(sort(requiredSymbols.variables)).toEqual(['a', 'b']);
    expect(sort(requiredSymbols.functions)).toEqual(['foo']);
  });

  it('should return variables that are inside a subexpression', () => {
    // given
    const parsedExpression = [
      [[{ type: tokens.SYMBOL, value: '5', symbolType: symbolTypes.NUMERIC }]],
      [
        [
          {
            type: tokens.SUBEXPRESSION,
            value: [[[{ type: tokens.SYMBOL, value: 'x', symbolType: symbolTypes.VARIABLE }]]],
          },
        ],
      ],
    ];

    // when
    const requiredSymbols = findRequiredSymbols(parsedExpression);

    // then
    expect(sort(requiredSymbols.variables)).toEqual(['x']);
  });

  it('should return variables and functions that are passed as function arguments', () => {
    // given
    const parsedExpression = [
      [
        [
          {
            type: tokens.FUNCTION,
            name: 'sqrt',
            arguments: [
              [
                [[{ type: tokens.SYMBOL, value: 'a', symbolType: symbolTypes.VARIABLE }]],
                [[{ type: tokens.SYMBOL, value: '1', symbolType: symbolTypes.NUMERIC }]],
              ],
              [[[{ type: tokens.SYMBOL, value: 'c', symbolType: symbolTypes.VARIABLE }]]],
            ],
          },
        ],
      ],
      [[{ type: tokens.SYMBOL, value: '5', symbolType: symbolTypes.NUMERIC }]],
    ];

    // when
    const requiredSymbols = findRequiredSymbols(parsedExpression);

    // then
    expect(sort(requiredSymbols.variables)).toEqual(['a', 'c']);
    expect(sort(requiredSymbols.functions)).toEqual(['sqrt']);
  });

  it('should return empty arrays for empty expression', () => {
    // given
    const parsedExpression = [];

    // when
    const requiredSymbols = findRequiredSymbols(parsedExpression);

    // then
    expect(requiredSymbols.variables).toEqual([]);
    expect(requiredSymbols.functions).toEqual([]);
  });
});
