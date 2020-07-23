import { constants } from './constants';
import tokenizeLine from './tokenizeLine';

const CodeTokenizerWithCache = () => {
  let cache = new Map();

  const tokenizeCodeWithCache = (code, options = {}) => {
    const tempCache = new Map();
    const codeLines = code.split('\n');
    const initialState = { values: constants, evaluatedLines: [] };
    const { evaluatedLines } = codeLines.reduce((acc, expression) => {
      const cacheKey = JSON.stringify({ values: acc.values, expression, options });
      const lineTokenizationResult = cache.has(cacheKey)
        ? cache.get(cacheKey)
        : tokenizeLine(acc.values, expression, options);
      tempCache.set(cacheKey, lineTokenizationResult);
      const { values, tokenizedLine } = lineTokenizationResult;
      return {
        values: { ...acc.values, ...values },
        evaluatedLines: [...acc.evaluatedLines, tokenizedLine],
      };
    }, initialState);

    cache = tempCache;

    return evaluatedLines;
  };

  return tokenizeCodeWithCache;
};

export default CodeTokenizerWithCache;
