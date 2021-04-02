import { constants } from './constants';
import tokenizeLine from './tokenizeLine';

const CodeTokenizerWithCache = () => {
  let cache = new Map();

  const tokenizeCodeWithCache = (code, options = {}) => {
    const tempCache = new Map();
    const codeLines = code.split('\n');
    const initialState = { values: constants, customFunctions: {}, evaluatedLines: [] };
    const { evaluatedLines } = codeLines.reduce((acc, expression) => {
      const cacheKey = JSON.stringify({
        values: acc.values,
        customFunctions: Object.entries(acc.customFunctions)
          .map(([key, customFunction]) => `${key}:${customFunction}`),
        expression,
        options,
      });
      const lineTokenizationResult = cache.has(cacheKey)
        ? cache.get(cacheKey)
        : tokenizeLine(acc.values, acc.customFunctions, expression, options);
      tempCache.set(cacheKey, lineTokenizationResult);
      const { values, customFunctions, tokenizedLine } = lineTokenizationResult;
      return {
        values: { ...acc.values, ...values },
        customFunctions: { ...acc.customFunctions, ...customFunctions },
        evaluatedLines: [...acc.evaluatedLines, tokenizedLine],
      };
    }, initialState);

    cache = tempCache;

    return evaluatedLines;
  };

  return tokenizeCodeWithCache;
};

export default CodeTokenizerWithCache;
