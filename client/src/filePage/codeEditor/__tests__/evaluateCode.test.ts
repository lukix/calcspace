import evaluateCode from '../evaluateCode';

describe('evaluateCode', () => {
  it('should append results to existing code', () => {
    // given
    const code = 'x = 2 + 3\ny = x + 2';

    // when
    const evaluatedCode = evaluateCode(code);

    // then
    expect(evaluatedCode).toEqual('x = 2 + 3 = 5\ny = x + 2 = 7');
  });

  it('should not append result when it is the same as assignment right-hand side', () => {
    // given
    const code = 'x = 5';

    // when
    const evaluatedCode = evaluateCode(code);

    // then
    expect(evaluatedCode).toEqual('x = 5');
  });

  it('should not append result when there are not evaluated symbols', () => {
    // given
    const code = 'a = x\na+1';

    // when
    const evaluatedCode = evaluateCode(code);

    // then
    expect(evaluatedCode).toEqual('a = x\na+1');
  });

  it('should not append result which is a function', () => {
    // given
    const code = 'sin';

    // when
    const evaluatedCode = evaluateCode(code);

    // then
    expect(evaluatedCode).toEqual('sin');
  });
});
