import tokens from '../tokens';
import symbolTypes from '../symbolTypes';
import { ParserError } from '../errors';
import classifySymbols from '../classifySymbols';

const { VARIABLE, NUMERIC, NUMERIC_WITH_UNIT } = symbolTypes;

describe('classifySymbols', () => {
  it('should correctly classify variable symbols', () => {
    // given
    const tokensList = [
      { type: tokens.SYMBOL, value: 'a' },
      { type: tokens.SYMBOL, value: 'ab' },
      { type: tokens.SYMBOL, value: 'ab2' },
      { type: tokens.SYMBOL, value: 'ab2ab' },
      { type: tokens.SYMBOL, value: 'a_1' },
      { type: tokens.SYMBOL, value: 'a_' },
    ];

    // when
    const result = classifySymbols(tokensList);

    // then
    expect(result).toEqual([
      { type: tokens.SYMBOL, value: 'a', symbolType: VARIABLE },
      { type: tokens.SYMBOL, value: 'ab', symbolType: VARIABLE },
      { type: tokens.SYMBOL, value: 'ab2', symbolType: VARIABLE },
      { type: tokens.SYMBOL, value: 'ab2ab', symbolType: VARIABLE },
      { type: tokens.SYMBOL, value: 'a_1', symbolType: VARIABLE },
      { type: tokens.SYMBOL, value: 'a_', symbolType: VARIABLE },
    ]);
  });

  it('should correctly classify numeric symbols', () => {
    // given
    const tokensList = [
      { type: tokens.SYMBOL, value: '0.234' },
      { type: tokens.SYMBOL, value: '2.34' },
      { type: tokens.SYMBOL, value: '2.0' },
    ];

    // when
    const result = classifySymbols(tokensList);

    // then
    expect(result).toEqual([
      {
        type: tokens.SYMBOL,
        value: '0.234',
        symbolType: NUMERIC,
        number: 0.234,
      },
      { type: tokens.SYMBOL, value: '2.34', symbolType: NUMERIC, number: 2.34 },
      { type: tokens.SYMBOL, value: '2.0', symbolType: NUMERIC, number: 2.0 },
    ]);
  });

  it('should correctly classify numeric symbols with units', () => {
    // given
    const tokensList = [
      { type: tokens.SYMBOL, value: '2kg' },
      { type: tokens.SYMBOL, value: '2.5m' },
      { type: tokens.SYMBOL, value: '0.3s' },
    ];

    // when
    const result = classifySymbols(tokensList);

    // then
    expect(result).toEqual([
      {
        type: tokens.SYMBOL,
        value: '2kg',
        symbolType: NUMERIC_WITH_UNIT,
        number: 2,
        unit: 'kg',
      },
      {
        type: tokens.SYMBOL,
        value: '2.5m',
        symbolType: NUMERIC_WITH_UNIT,
        number: 2.5,
        unit: 'm',
      },
      {
        type: tokens.SYMBOL,
        value: '0.3s',
        symbolType: NUMERIC_WITH_UNIT,
        number: 0.3,
        unit: 's',
      },
    ]);
  });

  [
    {
      value: '3.4.',
      description:
        'should throw an error when there is a symbol with two commas',
    },
    {
      value: '.5',
      description:
        'should throw an error when there is a symbol with leading comma',
    },
    {
      value: '04.5',
      description:
        'should throw an error when there is a symbol with leading zero and no following comma',
    },
    {
      value: '045',
      description:
        'should throw an error when there is a symbol with leading zero and no comma',
    },
    {
      value: '2a2',
      description:
        'should throw an error when there is a symbol with leading and trailing digits',
    },
    {
      value: 'abc.def',
      description:
        'should throw an error when there is a variable symbol with comma',
    },
    {
      value: '_a',
      description:
        'should throw an error when there is a variable symbol with leading underscore',
    },
    {
      value: '25kg_s',
      description: 'should throw an error when unit has underscore',
    },
    {
      value: '25kg.s',
      description: 'should throw an error when unit has commas',
    },
  ].forEach(({ value, description }) => {
    it(description, () => {
      // given
      const tokensList = [{ type: tokens.SYMBOL, value }];

      // when
      const testFunction = () => classifySymbols(tokensList);

      // then
      expect(testFunction).toThrow(ParserError);
    });
  });
});
