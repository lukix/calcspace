import pipe from 'ramda.pipe';
import parseToPrimaryTokens from './parseToPrimaryTokens';
import buildSubexpressions from './buildSubexpressions';
import buildFunctions from './buildFunctions';
import validateTokensList from './validateTokensList';
import validateSymbols from './validateSymbols';
import buildPrecedenceHierarchy from './buildPrecedenceHierarchy';

export const parseExpression = (expression: string) => {
  try {
    const parsedExpression = pipe(
      parseToPrimaryTokens,
      buildSubexpressions,
      buildFunctions,
      validateTokensList,
      validateSymbols,
      buildPrecedenceHierarchy
    )(expression);
    return { parsedExpression, isValid: true };
  } catch (error) {
    if (error.isParserError) {
      return { isValid: false, errorMessage: error.message };
    }
    throw error;
  }
};

export const evaluateParsedExpression = (parsedExpression: Array<Object>) => {
  // TODO
};
