import { constants } from './constants';

import parseLine from '../../math/parseLine';
import evaluateLine from '../../math/evaluateLine';
import tokenizeLine from './tokenizeLine';

const Cache = () => {
  let parsingCache = new Map();
  let lastOptions: string | null = null;
  let evaluatedLinesCache: { key: string; value: any }[] = [];

  return {
    invalidateOnOptionsChange: (options) => {
      const stringifiedOptions = JSON.stringify(options);
      if (lastOptions !== stringifiedOptions) {
        lastOptions = stringifiedOptions;
        evaluatedLinesCache = [];
      }
    },
    getParsedLine: ({ key, createValueIfNotExists }) => {
      const valueFromCache = parsingCache.get(key);
      if (valueFromCache) {
        return valueFromCache;
      }
      const value = createValueIfNotExists();
      parsingCache.set(key, value);
      return value;
    },
    getEvaluatedLine: ({ key, lineIndex, createValueIfNotExists }) => {
      const evaluationFromCache = evaluatedLinesCache[lineIndex];
      if (evaluationFromCache?.key === key) {
        return evaluationFromCache.value;
      }
      const evaluatedLine = createValueIfNotExists();
      evaluatedLinesCache = evaluatedLinesCache.slice(0, lineIndex); // Invalidate cache for following lines
      evaluatedLinesCache.push({ key, value: evaluatedLine });
      return evaluatedLine;
    },
    cleanUp: (expectedSize) => {
      const CACHE_SIZE_MARGIN = 1000;
      if (parsingCache.size > expectedSize + CACHE_SIZE_MARGIN) {
        parsingCache.clear();
      }
    },
  };
};

const CodeTokenizer = (cache = Cache()) => {
  const tokenizeCode = (code, options = {}) => {
    const codeLines = code.split('\n');

    cache.invalidateOnOptionsChange(options);
    cache.cleanUp(codeLines.length);

    const parsedLines = codeLines.map((lineString) => {
      return cache.getParsedLine({
        key: lineString,
        createValueIfNotExists: () => ({ ...parseLine(lineString), lineString }),
      });
    });

    const initialState = {
      values: constants,
      customFunctions: {},
      evaluatedLines: [],
    };
    const { evaluatedLines } = parsedLines.reduce((acc, lineParsingResult, lineIndex) => {
      const evaluatedLine = cache.getEvaluatedLine({
        key: lineParsingResult.lineString,
        lineIndex,
        createValueIfNotExists: () =>
          evaluateLine(acc.values, acc.customFunctions, lineParsingResult, options),
      });

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

  return tokenizeCode;
};

export default CodeTokenizer;
