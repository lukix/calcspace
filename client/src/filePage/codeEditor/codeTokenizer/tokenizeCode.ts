import { constants } from './constants';
import tokenizeLine from './tokenizeLine';

const tokenizeCode = (code) => {
  const codeLines = code.split('\n');
  const initialState = { values: constants, evaluatedLines: [] };
  const { evaluatedLines } = codeLines.reduce((acc, expression) => {
    const { values, tokenizedLine } = tokenizeLine(acc.values, expression);
    return {
      values: { ...acc.values, ...values },
      evaluatedLines: [...acc.evaluatedLines, tokenizedLine],
    };
  }, initialState);
  return evaluatedLines;
};

export default tokenizeCode;
