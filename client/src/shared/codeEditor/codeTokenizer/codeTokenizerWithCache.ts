import { constants } from './constants';
import tokenizeLine from './tokenizeLine';

const CodeTokenizerWithCache = () => {
  let cache = new Map();

  const tokenizeCodeWithCache = (code, options = {}) => {
    const tempCache = new Map();
    const codeLines = code.split('\n');
    const initialState = {
      values: constants,
      customFunctions: {},
      customFunctionsRaw: {},
      evaluatedLines: [],
    };
    const { evaluatedLines } = codeLines.reduce((acc, expression) => {
      const cacheKey = JSON.stringify({
        values: acc.values,
        customFunctions: Object.entries(acc.customFunctions).map(
          ([key]) => `${key}:${acc.customFunctionsRaw[key]}`
        ),
        expression,
        options,
      });
      const lineTokenizationResult = cache.has(cacheKey)
        ? cache.get(cacheKey)
        : tokenizeLine(
            acc.values,
            acc.customFunctions,
            acc.customFunctionsRaw,
            expression,
            options
          );
      tempCache.set(cacheKey, lineTokenizationResult);
      const { values, customFunctions, customFunctionsRaw, tokenizedLine } = lineTokenizationResult;
      return {
        values: { ...acc.values, ...values },
        customFunctions: { ...acc.customFunctions, ...customFunctions },
        customFunctionsRaw: { ...acc.customFunctionsRaw, ...customFunctionsRaw },
        evaluatedLines: [...acc.evaluatedLines, tokenizedLine],
      };
    }, initialState);

    cache = tempCache;

    return evaluatedLines;
  };

  return tokenizeCodeWithCache;
};

export default CodeTokenizerWithCache;
