import evaluateExpression from '../mathEngine/evaluateExpression';

const evaluateCode = code => {
  const expressions = code.split('\n');
  const initialState = { values: {}, expressions: [] };
  const { expressions: evaluatedExpressions } = expressions.reduce(
    (acc, expression) => {
      const { result, error, symbol, expression: expStr } = evaluateExpression(
        expression,
        acc.values
      );
      const showResult = result !== null && expStr !== `${result}`;
      const resultString = showResult ? ` = ${result}` : '';
      return {
        values:
          symbol && result !== null
            ? { ...acc.values, [symbol]: result }
            : acc.values,
        expressions: [...acc.expressions, `${expression}${resultString}`],
      };
    },
    initialState
  );
  return evaluatedExpressions.join('\n');
};

export default evaluateCode;
