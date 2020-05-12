import evaluateExpression from '../evaluateExpression';

describe('evaluateExpression', () => {
  it('should return correct value of expression without variables', () => {
    // given
    const expression = '4 + 2 + 0';
    const values = {};

    // when
    const { result, error } = evaluateExpression(expression, values);

    // then
    expect(error).toEqual(null);
    expect(result).toEqual({ number: 6, unit: [] });
  });

  it('should return correct value of expression with variables', () => {
    // given
    const expression = 'a + b * 2';
    const values = { a: { number: 2, unit: [] }, b: { number: 4, unit: [] } };

    // when
    const { result, error } = evaluateExpression(expression, values);

    // then
    expect(error).toEqual(null);
    expect(result).toEqual({ number: 10, unit: [] });
  });

  it('should return an error when given invalid expression', () => {
    // given
    const invalidExpression = '2 +*+ 2';
    const values = {};

    // when
    const { result, error } = evaluateExpression(invalidExpression, values);

    // then
    expect(error).not.toBeNull();
    expect(result).toEqual(null);
  });

  it('should return an error when given not enough values', () => {
    // given
    const expression = 'a + b';
    const values = { a: { number: 420, unit: [] } };

    // when
    const { result, error } = evaluateExpression(expression, values);

    // then
    expect(error).not.toBeNull();
    expect(result).toEqual(null);
  });
});
