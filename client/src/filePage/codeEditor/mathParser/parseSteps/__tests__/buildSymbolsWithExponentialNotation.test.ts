import tokens from '../../tokens';
import symbolTypes from '../../symbolTypes';
import buildSymbolsWithExponentialNotation from '../buildSymbolsWithExponentialNotation';

const { VARIABLE, NUMERIC, NUMERIC_WITH_UNIT } = symbolTypes;

describe('buildSymbolsWithExponentialNotation', () => {
  it('should build symbol for exponential notation with negative exponent', () => {
    // given
    const tokensList = [
      {
        type: tokens.SYMBOL,
        value: '2e',
        symbolType: NUMERIC_WITH_UNIT,
        number: 2,
        unit: 'e',
      },
      { type: tokens.OPERATOR, value: '-' },
      { type: tokens.SYMBOL, value: '3', number: 3, symbolType: NUMERIC },
    ];

    // when
    const result = buildSymbolsWithExponentialNotation(tokensList);

    // then
    expect(result).toEqual([
      { type: tokens.SYMBOL, value: '2e-3', number: 2e-3, symbolType: NUMERIC },
    ]);
  });

  it('should build symbol with unit for exponential notation with negative exponent', () => {
    // given
    const tokensList = [
      {
        type: tokens.SYMBOL,
        value: '2e',
        symbolType: NUMERIC_WITH_UNIT,
        number: 2,
        unit: 'e',
      },
      { type: tokens.OPERATOR, value: '-' },
      { type: tokens.SYMBOL, value: '3kg', number: 3, unit: 'kg', symbolType: NUMERIC_WITH_UNIT },
    ];

    // when
    const result = buildSymbolsWithExponentialNotation(tokensList);

    // then
    expect(result).toEqual([
      {
        type: tokens.SYMBOL,
        value: '2e-3kg',
        number: 2e-3,
        unit: 'kg',
        symbolType: NUMERIC_WITH_UNIT,
      },
    ]);
  });

  it('should return unmodified input when there is a space after "e" character', () => {
    // given
    const tokensList = [
      {
        type: tokens.SYMBOL,
        value: '2e',
        symbolType: NUMERIC_WITH_UNIT,
        number: 2,
        unit: 'e',
      },
      { type: tokens.SPACE },
      { type: tokens.OPERATOR, value: '-' },
      { type: tokens.SYMBOL, value: '3kg', number: 3, unit: 'kg', symbolType: NUMERIC_WITH_UNIT },
    ];

    // when
    const result = buildSymbolsWithExponentialNotation(tokensList);

    // then
    expect(result).toEqual([
      {
        type: tokens.SYMBOL,
        value: '2e',
        symbolType: NUMERIC_WITH_UNIT,
        number: 2,
        unit: 'e',
      },
      { type: tokens.SPACE },
      { type: tokens.OPERATOR, value: '-' },
      { type: tokens.SYMBOL, value: '3kg', number: 3, unit: 'kg', symbolType: NUMERIC_WITH_UNIT },
    ]);
  });

  it('should return unmodified input when there is a plus operator after "e" character', () => {
    // given
    const tokensList = [
      {
        type: tokens.SYMBOL,
        value: '2e',
        symbolType: NUMERIC_WITH_UNIT,
        number: 2,
        unit: 'e',
      },
      { type: tokens.OPERATOR, value: '+' },
      { type: tokens.SYMBOL, value: '3kg', number: 3, unit: 'kg', symbolType: NUMERIC_WITH_UNIT },
    ];

    // when
    const result = buildSymbolsWithExponentialNotation(tokensList);

    // then
    expect(result).toEqual([
      {
        type: tokens.SYMBOL,
        value: '2e',
        symbolType: NUMERIC_WITH_UNIT,
        number: 2,
        unit: 'e',
      },
      { type: tokens.OPERATOR, value: '+' },
      { type: tokens.SYMBOL, value: '3kg', number: 3, unit: 'kg', symbolType: NUMERIC_WITH_UNIT },
    ]);
  });

  it('should return unmodified input when potential exponent is a variable', () => {
    // given
    const tokensList = [
      {
        type: tokens.SYMBOL,
        value: '2e',
        symbolType: NUMERIC_WITH_UNIT,
        number: 2,
        unit: 'e',
      },
      { type: tokens.OPERATOR, value: '-' },
      { type: tokens.SYMBOL, value: 'a', symbolType: VARIABLE },
    ];

    // when
    const result = buildSymbolsWithExponentialNotation(tokensList);

    // then
    expect(result).toEqual([
      {
        type: tokens.SYMBOL,
        value: '2e',
        symbolType: NUMERIC_WITH_UNIT,
        number: 2,
        unit: 'e',
      },
      { type: tokens.OPERATOR, value: '-' },
      { type: tokens.SYMBOL, value: 'a', symbolType: VARIABLE },
    ]);
  });
});
