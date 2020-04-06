import evaluateExpression from './mathEngine/evaluateExpression';

export const tokens = {
  NORMAL: 'NORMAL',
  VIRTUAL: 'VIRTUAL',
  ERROR: 'ERROR',
};

const evaluateCode = code => {
  const codeLines = code.split('\n');
  const initialState = { values: {}, evaluatedLines: [] };
  const { evaluatedLines } = codeLines.reduce((acc, expression) => {
    const { result, error, symbol, expression: expStr } = evaluateExpression(
      expression,
      acc.values
    );
    const showResult = result !== null && expStr !== `${result}`;
    const resultString = showResult ? ` = ${result}` : '';
    const tokenizedLine = [
      {
        value: expression,
        tags: [tokens.NORMAL, ...(error ? [tokens.ERROR] : [])],
      },
      { value: resultString, tags: [tokens.VIRTUAL] },
    ];
    return {
      values:
        symbol && result !== null
          ? { ...acc.values, [symbol]: result }
          : acc.values,
      evaluatedLines: [...acc.evaluatedLines, tokenizedLine],
    };
  }, initialState);
  return evaluatedLines;
};

export default evaluateCode;
