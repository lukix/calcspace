import { constants } from './constants';
import tokenizeLine from './tokenizeLine';

const tokenizeCode = (code, options = {}) => {
  const codeLines = code.split('\n');
  const initialState = { values: constants, evaluatedLines: [] };
  const { evaluatedLines } = codeLines.reduce((acc, expression) => {
    const { values, tokenizedLine } = tokenizeLine(acc.values, expression, options);
    return {
      values: { ...acc.values, ...values },
      evaluatedLines: [...acc.evaluatedLines, tokenizedLine],
    };
  }, initialState);
  return evaluatedLines;
};

export default tokenizeCode;
