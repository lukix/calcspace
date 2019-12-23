import evaluateExpression from '../mathEngine/evaluateExpression';

const evaluateExpressionsList = expressions => {
  const initialState = { values: {}, expressions: [] };
  const { expressions: evaluatedExpressions } = expressions.reduce(
    (acc, expression) => {
      const { result, error, symbol, expression: expStr } = evaluateExpression(
        expression.value,
        acc.values
      );
      const showResult = expStr !== `${result}`;
      return {
        values:
          symbol && result !== null
            ? { ...acc.values, [symbol]: result }
            : acc.values,
        expressions: [
          ...acc.expressions,
          { ...expression, result, error, showResult },
        ],
      };
    },
    initialState
  );
  return evaluatedExpressions;
};

export default evaluateExpressionsList;
