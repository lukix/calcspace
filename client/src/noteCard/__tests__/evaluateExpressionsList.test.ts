import evaluateExpressionsList from '../evaluateExpressionsList';

describe('evaluateExpressionsList', () => {
  it('should evaluate expressions when given simple list', () => {
    // given
    const expressionsList = [
      { value: 'x = 5', result: null, error: null },
      { value: 'y = x + 2', result: null, error: null },
    ];

    // when
    const evaluatedList = evaluateExpressionsList(expressionsList);

    // then
    expect(evaluatedList).toEqual([
      { value: 'x = 5', result: 5, error: null },
      { value: 'y = x + 2', result: 7, error: null },
    ]);
  });

  it('should not evaluate expression which uses not evaluated symbols', () => {
    // given
    const expressionsList = [
      { value: 'a = x', result: null, error: null },
      { value: 'a + 1', result: null, error: null },
    ];

    // when
    const evaluatedList = evaluateExpressionsList(expressionsList);

    // then
    expect(evaluatedList.length).toEqual(2);

    expect(evaluatedList[0]).toMatchObject({ value: 'a = x', result: null });
    expect(typeof evaluatedList[0].error).not.toEqual(null);

    expect(evaluatedList[1]).toMatchObject({ value: 'a + 1', result: null });
    expect(typeof evaluatedList[1].error).not.toEqual(null);
  });
});
