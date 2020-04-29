import pipe from 'ramda.pipe';
import parseToPrimaryTokens from './parseToPrimaryTokens';
import buildSubexpressions from './buildSubexpressions';
import buildFunctions from './buildFunctions';
import validateTokensList from './validateTokensList';
import validateSymbols from './validateSymbols';
import buildPrecedenceHierarchy from './buildPrecedenceHierarchy';

export { default as evaluateParsedExpression } from './evaluateParsedExpression';

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
    console.error(error);
    return { isValid: false, errorMessage: 'Expression cannot be parsed' };
  }
};
