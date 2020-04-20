import evaluateCode, { tokens } from '../evaluateCode';

describe('evaluateCode - tokenization test', () => {
  it('should return tokenized structure with results', () => {
    // given
    const code = 'x = 2 + 3\ny = x + 2';

    // when
    const evaluatedCode = evaluateCode(code);

    // then
    expect(evaluatedCode).toEqual([
      [
        { value: 'x = 2 + 3', tags: [tokens.NORMAL] },
        { value: ' = 5', tags: [tokens.VIRTUAL] },
      ],
      [
        { value: 'y = x + 2', tags: [tokens.NORMAL] },
        { value: ' = 7', tags: [tokens.VIRTUAL] },
      ],
    ]);
  });

  it('should not append result when it is the same as assignment right-hand side', () => {
    // given
    const code = 'x = 5';

    // when
    const evaluatedCode = evaluateCode(code);

    // then
    expect(evaluatedCode).toEqual([
      [{ value: 'x = 5', tags: [tokens.NORMAL] }],
    ]);
  });

  it('should tag expression with error if there are not evaluated symbols', () => {
    // given
    const code = 'a = x\na + 1';

    // when
    const evaluatedCode = evaluateCode(code);

    // then
    expect(evaluatedCode).toEqual([
      [{ value: 'a = x', tags: [tokens.NORMAL, tokens.ERROR] }],
      [{ value: 'a + 1', tags: [tokens.NORMAL, tokens.ERROR] }],
    ]);
  });

  it('should not append result which is a function', () => {
    // given
    const code = 'sin';

    // when
    const evaluatedCode = evaluateCode(code);

    // then
    expect(evaluatedCode).toEqual([
      [{ value: 'sin', tags: [tokens.NORMAL, tokens.ERROR] }],
    ]);
  });
});
