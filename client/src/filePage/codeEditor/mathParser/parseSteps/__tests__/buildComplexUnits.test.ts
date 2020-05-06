import tokens from '../../tokens';
import symbolTypes from '../../symbolTypes';
import buildComplexUnits from '../buildComplexUnits';

describe('buildComplexUnits', () => {
  it('should attach following units to "numeric symbol with unit"', () => {
    // given
    const tokensList = [
      {
        type: tokens.SYMBOL,
        value: '5m',
        symbolType: symbolTypes.NUMERIC_WITH_UNIT,
        unit: 'm',
      },
      { type: tokens.OPERATOR, value: '/' },
      { type: tokens.SYMBOL, value: 's', symbolType: symbolTypes.VARIABLE },
      { type: tokens.OPERATOR, value: '+' },
      { type: tokens.SYMBOL, value: 'x', symbolType: symbolTypes.VARIABLE },
    ];

    // when
    const result = buildComplexUnits(tokensList);

    // then
    expect(result).toEqual([
      {
        type: tokens.SYMBOL,
        value: '5m/s',
        symbolType: symbolTypes.NUMERIC_WITH_UNIT,
        unit: 'm/s',
      },
      { type: tokens.OPERATOR, value: '+' },
      { type: tokens.SYMBOL, value: 'x', symbolType: symbolTypes.VARIABLE },
    ]);
  });

  it('should work with power operator', () => {
    // given
    const tokensList = [
      {
        type: tokens.SYMBOL,
        value: '5N',
        symbolType: symbolTypes.NUMERIC_WITH_UNIT,
        unit: 'N',
      },
      { type: tokens.OPERATOR, value: '^' },
      { type: tokens.SYMBOL, value: '2', symbolType: symbolTypes.NUMERIC },
    ];

    // when
    const result = buildComplexUnits(tokensList);

    // then
    expect(result).toEqual([
      {
        type: tokens.SYMBOL,
        value: '5N^2',
        symbolType: symbolTypes.NUMERIC_WITH_UNIT,
        unit: 'N^2',
      },
    ]);
  });

  it('should work with complex units', () => {
    // given
    const tokensList = [
      {
        type: tokens.SYMBOL,
        value: '5N',
        symbolType: symbolTypes.NUMERIC_WITH_UNIT,
        unit: 'N',
      },
      { type: tokens.OPERATOR, value: '*' },
      { type: tokens.SYMBOL, value: 'm', symbolType: symbolTypes.VARIABLE },
      { type: tokens.OPERATOR, value: '^' },
      { type: tokens.SYMBOL, value: '2', symbolType: symbolTypes.NUMERIC },
      { type: tokens.OPERATOR, value: '/' },
      { type: tokens.SYMBOL, value: 's', symbolType: symbolTypes.VARIABLE },
      { type: tokens.OPERATOR, value: '/' },
      { type: tokens.SYMBOL, value: 's', symbolType: symbolTypes.VARIABLE },
      { type: tokens.OPERATOR, value: '*' },
      { type: tokens.SYMBOL, value: 'A', symbolType: symbolTypes.VARIABLE },
    ];

    // when
    const result = buildComplexUnits(tokensList);

    // then
    expect(result).toEqual([
      {
        type: tokens.SYMBOL,
        value: '5N*m^2/s/s*A',
        symbolType: symbolTypes.NUMERIC_WITH_UNIT,
        unit: 'N*m^2/s/s*A',
      },
    ]);
  });

  it('should NOT attach variable powers', () => {
    // given
    const tokensList = [
      {
        type: tokens.SYMBOL,
        value: '5N',
        symbolType: symbolTypes.NUMERIC_WITH_UNIT,
        unit: 'N',
      },
      { type: tokens.OPERATOR, value: '^' },
      { type: tokens.SYMBOL, value: 'x', symbolType: symbolTypes.VARIABLE },
    ];

    // when
    const result = buildComplexUnits(tokensList);

    // then
    expect(result).toEqual([
      {
        type: tokens.SYMBOL,
        value: '5N',
        symbolType: symbolTypes.NUMERIC_WITH_UNIT,
        unit: 'N',
      },
      { type: tokens.OPERATOR, value: '^' },
      { type: tokens.SYMBOL, value: 'x', symbolType: symbolTypes.VARIABLE },
    ]);
  });

  it('should NOT attach following units when they are separated by space before operator', () => {
    // given
    const tokensList = [
      {
        type: tokens.SYMBOL,
        value: '5m',
        symbolType: symbolTypes.NUMERIC_WITH_UNIT,
        unit: 'm',
      },
      { type: tokens.SPACE },
      { type: tokens.OPERATOR, value: '/' },
      { type: tokens.SYMBOL, value: 's', symbolType: symbolTypes.VARIABLE },
    ];

    // when
    const result = buildComplexUnits(tokensList);

    // then
    expect(result).toEqual([
      {
        type: tokens.SYMBOL,
        value: '5m',
        symbolType: symbolTypes.NUMERIC_WITH_UNIT,
        unit: 'm',
      },
      { type: tokens.SPACE },
      { type: tokens.OPERATOR, value: '/' },
      { type: tokens.SYMBOL, value: 's', symbolType: symbolTypes.VARIABLE },
    ]);
  });

  it('should NOT attach following units when they are separated by space after operator', () => {
    // given
    const tokensList = [
      {
        type: tokens.SYMBOL,
        value: '5m',
        symbolType: symbolTypes.NUMERIC_WITH_UNIT,
        unit: 'm',
      },
      { type: tokens.OPERATOR, value: '/' },
      { type: tokens.SPACE },
      { type: tokens.SYMBOL, value: 's', symbolType: symbolTypes.VARIABLE },
    ];

    // when
    const result = buildComplexUnits(tokensList);

    // then
    expect(result).toEqual([
      {
        type: tokens.SYMBOL,
        value: '5m',
        symbolType: symbolTypes.NUMERIC_WITH_UNIT,
        unit: 'm',
      },
      { type: tokens.OPERATOR, value: '/' },
      { type: tokens.SPACE },
      { type: tokens.SYMBOL, value: 's', symbolType: symbolTypes.VARIABLE },
    ]);
  });

  it('should NOT attach following units when they are separated by spaces', () => {
    // given
    const tokensList = [
      {
        type: tokens.SYMBOL,
        value: '5m',
        symbolType: symbolTypes.NUMERIC_WITH_UNIT,
        unit: 'm',
      },
      { type: tokens.SPACE },
      { type: tokens.OPERATOR, value: '/' },
      { type: tokens.SPACE },
      { type: tokens.SYMBOL, value: 's', symbolType: symbolTypes.VARIABLE },
    ];

    // when
    const result = buildComplexUnits(tokensList);

    // then
    expect(result).toEqual([
      {
        type: tokens.SYMBOL,
        value: '5m',
        symbolType: symbolTypes.NUMERIC_WITH_UNIT,
        unit: 'm',
      },
      { type: tokens.SPACE },
      { type: tokens.OPERATOR, value: '/' },
      { type: tokens.SPACE },
      { type: tokens.SYMBOL, value: 's', symbolType: symbolTypes.VARIABLE },
    ]);
  });

  it('should NOT attach units for not applicable operators', () => {
    // given
    const tokensList = [
      {
        type: tokens.SYMBOL,
        value: '5m',
        symbolType: symbolTypes.NUMERIC_WITH_UNIT,
        unit: 'm',
      },
      { type: tokens.OPERATOR, value: '+' },
      { type: tokens.SYMBOL, value: 's', symbolType: symbolTypes.VARIABLE },
      { type: tokens.OPERATOR, value: '+' },
      {
        type: tokens.SYMBOL,
        value: '3m',
        symbolType: symbolTypes.NUMERIC_WITH_UNIT,
        unit: 'm',
      },
      { type: tokens.OPERATOR, value: '-' },
      { type: tokens.SYMBOL, value: 's', symbolType: symbolTypes.VARIABLE },
      { type: tokens.OPERATOR, value: '+' },
      {
        type: tokens.SYMBOL,
        value: '2f',
        symbolType: symbolTypes.NUMERIC_WITH_UNIT,
        unit: 'f',
      },
      { type: tokens.OPERATOR, value: '(' },
      { type: tokens.SYMBOL, value: '9', symbolType: symbolTypes.NUMERIC },
      { type: tokens.OPERATOR, value: ')' },
    ];

    // when
    const result = buildComplexUnits(tokensList);

    // then
    expect(result).toEqual([
      {
        type: tokens.SYMBOL,
        value: '5m',
        symbolType: symbolTypes.NUMERIC_WITH_UNIT,
        unit: 'm',
      },
      { type: tokens.OPERATOR, value: '+' },
      { type: tokens.SYMBOL, value: 's', symbolType: symbolTypes.VARIABLE },
      { type: tokens.OPERATOR, value: '+' },
      {
        type: tokens.SYMBOL,
        value: '3m',
        symbolType: symbolTypes.NUMERIC_WITH_UNIT,
        unit: 'm',
      },
      { type: tokens.OPERATOR, value: '-' },
      { type: tokens.SYMBOL, value: 's', symbolType: symbolTypes.VARIABLE },
      { type: tokens.OPERATOR, value: '+' },
      {
        type: tokens.SYMBOL,
        value: '2f',
        symbolType: symbolTypes.NUMERIC_WITH_UNIT,
        unit: 'f',
      },
      { type: tokens.OPERATOR, value: '(' },
      { type: tokens.SYMBOL, value: '9', symbolType: symbolTypes.NUMERIC },
      { type: tokens.OPERATOR, value: ')' },
    ]);
  });

  it('should support units with negative powers"', () => {
    // given
    const tokensList = [
      {
        type: tokens.SYMBOL,
        value: '5m',
        symbolType: symbolTypes.NUMERIC_WITH_UNIT,
        unit: 'm',
      },
      { type: tokens.OPERATOR, value: '^' },
      { type: tokens.OPERATOR, value: '-' },
      { type: tokens.SYMBOL, value: '2', number: 2, symbolType: symbolTypes.NUMERIC },
    ];

    // when
    const result = buildComplexUnits(tokensList);

    // then
    expect(result).toEqual([
      {
        type: tokens.SYMBOL,
        value: '5m^-2',
        symbolType: symbolTypes.NUMERIC_WITH_UNIT,
        unit: 'm^-2',
      },
    ]);
  });
});
