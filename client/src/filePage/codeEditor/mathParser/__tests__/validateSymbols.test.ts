import tokens from '../tokens';
import { ParserError } from '../errors';
import validateSymbols from '../validateSymbols';

describe('validateSymbols', () => {
  it('should work as identity function when all symbols are valid', () => {
    // given
    const tokensList = [
      { type: tokens.SYMBOL, value: 'abc_1' },
      { type: tokens.OPERATOR, value: '*' },
      {
        type: tokens.FUNCTION,
        name: 'foo',
        subexpressionContent: [
          { type: tokens.SYMBOL, value: '62.1' },
          { type: tokens.OPERATOR, value: '*' },
          { type: tokens.SYMBOL, value: 'abc2' },
        ],
      },
    ];

    // when
    const result = validateSymbols(tokensList);

    // then
    expect(result).toEqual(tokensList);
  });

  it('should validate subexpressions', () => {
    // given
    const tokensList = [
      {
        type: tokens.SUBEXPRESSION,
        value: [{ type: tokens.SYMBOL, value: '_1.2.3_' }],
      },
    ];

    // when
    const testFunction = () => validateSymbols(tokensList);

    // then
    expect(testFunction).toThrow(ParserError);
  });

  it('should validate function names', () => {
    // given
    const tokensList = [
      {
        type: tokens.FUNCTION,
        name: '_1.2.3_',
        subexpressionContent: [{ type: tokens.SYMBOL, value: '5' }],
      },
    ];

    // when
    const testFunction = () => validateSymbols(tokensList);

    // then
    expect(testFunction).toThrow(ParserError);
  });

  it(`should validate function's subexpression`, () => {
    // given
    const tokensList = [
      {
        type: tokens.FUNCTION,
        name: 'foo',
        subexpressionContent: [{ type: tokens.SYMBOL, value: '_1.2.3_' }],
      },
    ];

    // when
    const testFunction = () => validateSymbols(tokensList);

    // then
    expect(testFunction).toThrow(ParserError);
  });

  [
    {
      testDescription:
        'should throw an error when number symbol has more than 1 comma',
      symbolValue: '2.1.1',
    },
    {
      testDescription:
        'should throw an error when variable symbol starts with a digit',
      symbolValue: '5a',
    },
    {
      testDescription: 'should throw an error when variable symbol has commas',
      symbolValue: 'a.2',
    },
    {
      testDescription:
        'should throw an error when variable symbol has leading underscore',
      symbolValue: '_abc',
    },
    {
      testDescription:
        'should throw an error when variable symbol has trailing underscore',
      symbolValue: 'abc_',
    },
    {
      testDescription: `should throw an error when symbol is named 'Infinity'`,
      symbolValue: 'Infinity',
    },
  ].forEach(({ testDescription, symbolValue }) => {
    it(testDescription, () => {
      // given
      const tokensList = [{ type: tokens.SYMBOL, value: symbolValue }];

      // when
      const testFunction = () => validateSymbols(tokensList);

      // then
      expect(testFunction).toThrow(ParserError);
    });
  });
});
