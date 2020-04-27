import { parseExpression, evaluateParsedExpression } from '../index';

describe('evaluateParsedExpression', () => {
  it('should evaluate addition expression', () => {
    // given
    const expression = '5 + 7 + 13';
    const { parsedExpression } = parseExpression(expression);

    // when
    const result = evaluateParsedExpression(parsedExpression);

    // then
    expect(result).toEqual(25);
  });

  it('should evaluate addition expression with symbols', () => {
    // given
    const expression = 'a + b + 1';
    const { parsedExpression } = parseExpression(expression);

    // when
    const result = evaluateParsedExpression(parsedExpression, {
      values: { a: 2, b: 3 },
    });

    // then
    expect(result).toEqual(6);
  });

  it('should evaluate expression respecting operators precedence', () => {
    // given
    const expression = '2^3 + 2 * 3 * (5 - 2)';
    const { parsedExpression } = parseExpression(expression);

    // when
    const result = evaluateParsedExpression(parsedExpression);

    // then
    expect(result).toEqual(26);
  });

  it('should evaluate expression with functions', () => {
    // given
    const expression = '-a + foo(6 + 3)';
    const { parsedExpression } = parseExpression(expression);

    // when
    const result = evaluateParsedExpression(parsedExpression, {
      values: { a: -1 },
      functions: { foo: (v) => Math.sqrt(v) },
    });

    // then
    expect(result).toEqual(4);
  });

  it('should evaluate expression with a chain of powers', () => {
    // given
    const expression = '2^3^2';
    const { parsedExpression } = parseExpression(expression);

    // when
    const result = evaluateParsedExpression(parsedExpression);

    // then
    expect(result).toEqual(512);
  });

  it('should evaluate expression with division', () => {
    // given
    const expression = '2 * 10 / 5';
    const { parsedExpression } = parseExpression(expression);

    // when
    const result = evaluateParsedExpression(parsedExpression);

    // then
    expect(result).toEqual(4);
  });

  it('should throw an error when there are undefined variables', () => {
    // given
    const expression = 'a + b';
    const { parsedExpression } = parseExpression(expression);
    const options = { values: { a: 5 } };

    // when
    const testFunction = () =>
      evaluateParsedExpression(parsedExpression, options);

    // then
    expect(testFunction).toThrow();
  });

  it('should throw an error when there are undefined functions', () => {
    // given
    const expression = 'a + foo(3)';
    const { parsedExpression } = parseExpression(expression);
    const options = { values: { a: 5 } };

    // when
    const testFunction = () =>
      evaluateParsedExpression(parsedExpression, options);

    // then
    expect(testFunction).toThrow();
  });
});
