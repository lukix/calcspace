import evaluateExpression from '../evaluateExpression';

describe('evaluateExpression', () => {
  it('should return correct value of expression without variables', () => {
    // given
    const expression = 'x = 5';
    const values = {};

    // when
    const { result, error, symbol } = evaluateExpression(expression, values);

    // then
    expect(error).toEqual(null);
    expect(symbol).toEqual('x');
    expect(result).toEqual({ number: 5, unit: [] });
  });

  it('should return correct value of expression with variables', () => {
    // given
    const expression = 'a + b * 2';
    const values = { a: { number: 2, unit: [] }, b: { number: 4, unit: [] } };

    // when
    const { result, error, symbol } = evaluateExpression(expression, values);

    // then
    expect(error).toEqual(null);
    expect(symbol).toEqual(null);
    expect(result).toEqual({ number: 10, unit: [] });
  });

  it('should return an error when given invalid expression', () => {
    // given
    const invalidExpression = '2 +*+ 2';
    const values = {};

    // when
    const { result, error, symbol } = evaluateExpression(invalidExpression, values);

    // then
    expect(error).not.toBeNull();
    expect(symbol).toEqual(null);
    expect(result).toEqual(null);
  });

  it('should return an error when given not enough values', () => {
    // given
    const expression = 'a + b';
    const values = { a: { number: 420, unit: [] } };

    // when
    const { result, error, symbol } = evaluateExpression(expression, values);

    // then
    expect(error).not.toBeNull();
    expect(symbol).toEqual(null);
    expect(result).toEqual(null);
  });

  it('should return an error when defining a variable with a name of an existing function', () => {
    // given
    const invalidExpression = 'sin = 5';
    const values = {};
    const functions = { sin: ({ number, unit }) => ({ number: Math.sin(number), unit }) };

    // when
    const { result, error, symbol } = evaluateExpression(invalidExpression, values, functions);

    // then
    expect(error).not.toBeNull();
    expect(symbol).toEqual(null);
    expect(result).toEqual(null);
  });
});
