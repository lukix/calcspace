import { constants } from './constants';

import evaluateLine from './tokenizeLine/evaluateLine';
import tokenizeLine from './tokenizeLine';

const CodeTokenizerWithCache = () => {
  // TODO: Add cache back
  const tokenizeCodeWithCache = (code, options = {}) => {
    const codeLines = code.split('\n');
    const initialState = {
      values: constants,
      customFunctions: {},
      evaluatedLines: [],
    };
    const { evaluatedLines } = codeLines.reduce((acc, codeLine) => {
      const evaluatedLine = evaluateLine(acc.values, acc.customFunctions, codeLine, options);
      return {
        values: { ...acc.values, ...evaluatedLine.newVariable },
        customFunctions: { ...acc.customFunctions, ...evaluatedLine.newFunction },
        evaluatedLines: [...acc.evaluatedLines, evaluatedLine],
      };
    }, initialState);

    const tokenizedLines = evaluatedLines.map((evaluatedLine) =>
      tokenizeLine(evaluatedLine, options)
    );

    return tokenizedLines;
  };

  return tokenizeCodeWithCache;
};

export default CodeTokenizerWithCache;
