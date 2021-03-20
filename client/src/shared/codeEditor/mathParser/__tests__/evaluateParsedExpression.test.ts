import { parseExpression, evaluateParsedExpression } from '../index';

describe('evaluateParsedExpression', () => {
  it('should evaluate addition expression', () => {
    // given
    const expression = '5 + 7 + 13';
    const { parsedExpression } = parseExpression(expression);

    // when
    const result = evaluateParsedExpression(parsedExpression);

    // then
    expect(result).toEqual({ number: 25, unit: [] });
  });

  it('should evaluate addition expression with symbols', () => {
    // given
    const expression = 'a + b + 1';
    const { parsedExpression } = parseExpression(expression);

    // when
    const result = evaluateParsedExpression(parsedExpression, {
      values: {
        a: { number: 2, unit: [] },
        b: { number: 3, unit: [] },
      },
    });

    // then
    expect(result).toEqual({ number: 6, unit: [] });
  });

  it('should evaluate expression respecting operators precedence', () => {
    // given
    const expression = '2^3 + 2 * 3 * (5 - 2)';
    const { parsedExpression } = parseExpression(expression);

    // when
    const result = evaluateParsedExpression(parsedExpression);

    // then
    expect(result).toEqual({ number: 26, unit: [] });
  });

  it('should evaluate expression with functions', () => {
    // given
    const expression = '-a + foo(6 + 3)';
    const { parsedExpression } = parseExpression(expression);

    // when
    const result = evaluateParsedExpression(parsedExpression, {
      values: { a: { number: -1, unit: [] } },
      functions: {
        foo: (value) => ({
          number: Math.sqrt(value.number),
          unit: value.unit.map((unit) => ({ ...unit, power: unit.power / 2 })),
        }),
      },
    });

    // then
    expect(result).toEqual({ number: 4, unit: [] });
  });

  it('should evaluate expression with functions operating on units', () => {
    // given
    const expression = 'foo(9m^2)';
    const { parsedExpression } = parseExpression(expression);

    // when
    const result = evaluateParsedExpression(parsedExpression, {
      values: { a: { number: -1, unit: [] } },
      functions: {
        foo: (value) => ({
          number: Math.sqrt(value.number),
          unit: value.unit.map((unit) => ({ ...unit, power: unit.power / 2 })),
        }),
      },
      unitsMap: new Map([['m', { multiplier: 1, baseUnits: [{ unit: 'm', power: 1 }] }]]),
    });

    // then
    expect(result).toEqual({ number: 3, unit: [{ unit: 'm', power: 1 }] });
  });

  it('should evaluate expression with a chain of powers', () => {
    // given
    const expression = '2^3^2';
    const { parsedExpression } = parseExpression(expression);

    // when
    const result = evaluateParsedExpression(parsedExpression);

    // then
    expect(result).toEqual({ number: 512, unit: [] });
  });

  it('should evaluate expression with division', () => {
    // given
    const expression = '2 * 10 / 5';
    const { parsedExpression } = parseExpression(expression);

    // when
    const result = evaluateParsedExpression(parsedExpression);

    // then
    expect(result).toEqual({ number: 4, unit: [] });
  });

  it("should evaluate expression where power's units are cancelled out", () => {
    // given
    const expression = '5^(3s / 1s)';
    const { parsedExpression } = parseExpression(expression);
    const unitsMap = new Map([['s', { multiplier: 1, baseUnits: [{ unit: 's', power: 1 }] }]]);
    const options = { unitsMap };

    // when
    const result = evaluateParsedExpression(parsedExpression, options);

    // then
    expect(result).toEqual({ number: 125, unit: [] });
  });

  it('should throw an error when power has units', () => {
    // given
    const expression = '5^(2kg)';
    const { parsedExpression } = parseExpression(expression);

    // when
    const testFunction = () => evaluateParsedExpression(parsedExpression);

    // then
    expect(testFunction).toThrow();
  });

  it('should throw an error when there are undefined variables', () => {
    // given
    const expression = 'a + b';
    const { parsedExpression } = parseExpression(expression);
    const options = { values: { a: { number: 5, unit: [] } } };

    // when
    const testFunction = () => evaluateParsedExpression(parsedExpression, options);

    // then
    expect(testFunction).toThrow();
  });

  it('should throw an error when there are undefined functions', () => {
    // given
    const expression = 'a + foo(3)';
    const { parsedExpression } = parseExpression(expression);
    const options = { values: { a: { number: 5, unit: [] } } };

    // when
    const testFunction = () => evaluateParsedExpression(parsedExpression, options);

    // then
    expect(testFunction).toThrow();
  });

  it('should remove units with power 0', () => {
    // given
    const expression = '1s * 1s^(-1)';
    const { parsedExpression } = parseExpression(expression);
    const unitsMap = new Map([['s', { multiplier: 1, baseUnits: [{ unit: 's', power: 1 }] }]]);

    // when
    const result = evaluateParsedExpression(parsedExpression, { unitsMap });

    // then
    expect(result).toEqual({ number: 1, unit: [] });
  });

  it('should evaluate expression with units', () => {
    // given
    const expression = '1kg/ms * 1min';
    const { parsedExpression } = parseExpression(expression);
    const unitsMap = new Map([
      ['kg', { multiplier: 1, baseUnits: [{ unit: 'kg', power: 1 }] }],
      ['ms', { multiplier: 1e-3, baseUnits: [{ unit: 's', power: 1 }] }],
      ['min', { multiplier: 60, baseUnits: [{ unit: 's', power: 1 }] }],
    ]);

    // when
    const result = evaluateParsedExpression(parsedExpression, { unitsMap });

    // then
    expect(result).toEqual({ number: 60000, unit: [{ unit: 'kg', power: 1 }] });
  });

  it('should add two value with different but compatible units', () => {
    // given
    const expression = '1min + 10s';
    const { parsedExpression } = parseExpression(expression);
    const unitsMap = new Map([
      ['min', { multiplier: 60, baseUnits: [{ unit: 's', power: 1 }] }],
      ['s', { multiplier: 1, baseUnits: [{ unit: 's', power: 1 }] }],
    ]);

    // when
    const result = evaluateParsedExpression(parsedExpression, { unitsMap });

    // then
    expect(result).toEqual({ number: 70, unit: [{ unit: 's', power: 1 }] });
  });
});
