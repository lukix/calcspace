import { constants } from './constants';

import parseLine from './tokenizeLine/parseLine';
import evaluateLine from './tokenizeLine/evaluateLine';
import tokenizeLine from './tokenizeLine';

const CodeTokenizerWithCache = () => {
  // TODO: Add cache back
  const tokenizeCodeWithCache = (code, options = {}) => {
    const codeLines = code.split('\n');
    const parsedLines = codeLines.map((lineString) => ({ ...parseLine(lineString), lineString }));

    const initialState = {
      values: constants,
      customFunctions: {},
      evaluatedLines: [],
    };
    const { evaluatedLines } = parsedLines.reduce((acc, lineParsingResult) => {
      const evaluatedLine = evaluateLine(
        acc.values,
        acc.customFunctions,
        lineParsingResult,
        options
      );
      return {
        values: { ...acc.values, ...evaluatedLine.newVariable },
        customFunctions: { ...acc.customFunctions, ...evaluatedLine.newFunction },
        evaluatedLines: [
          ...acc.evaluatedLines,
          { ...evaluatedLine, lineString: lineParsingResult.lineString },
        ],
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
