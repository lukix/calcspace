import evaluateExpression from '../evaluateExpression';
import ERROR_TYPES from '../errorTypes';

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
    expect(result).toEqual(5);
  });

  it('should return correct value of expression with variables', () => {
    // given
    const expression = 'a + b * 2';
    const values = { a: 2, b: 4 };

    // when
    const { result, error, symbol } = evaluateExpression(expression, values);

    // then
    expect(error).toEqual(null);
    expect(symbol).toEqual(null);
    expect(result).toEqual(10);
  });

  it('should return an error when given invalid expression', () => {
    // given
    const invalidExpression = '2 +*+ 2';
    const values = {};

    // when
    const { result, error, symbol } = evaluateExpression(
      invalidExpression,
      values
    );

    // then
    expect(error).toMatchObject({ type: ERROR_TYPES.INVALID_EXPRESSION });
    expect(symbol).toEqual(null);
    expect(result).toEqual(null);
  });

  it('should return an error when given not enough values', () => {
    // given
    const expression = 'a + b';
    const values = { a: 420 };

    // when
    const { result, error, symbol } = evaluateExpression(expression, values);

    // then
    expect(error).toMatchObject({ type: ERROR_TYPES.UNDEFINED_VARIABLE });
    expect(symbol).toEqual(null);
    expect(result).toEqual(null);
  });
});
