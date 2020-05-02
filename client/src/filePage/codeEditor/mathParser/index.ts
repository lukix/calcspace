import pipe from 'ramda.pipe';
import parseToPrimaryTokens from './parseToPrimaryTokens';
import classifySymbols from './classifySymbols';
import buildSubexpressions from './buildSubexpressions';
import buildFunctions from './buildFunctions';
import validateTokensList from './validateTokensList';
import buildPrecedenceHierarchy from './buildPrecedenceHierarchy';
import buildComplexUnits from './buildComplexUnits';
import tokens from './tokens';

export { default as evaluateParsedExpression } from './evaluateParsedExpression';

const removeSpaceTokens = (tokensList) => tokensList.filter((token) => token.type !== tokens.SPACE);

export const parseExpression = (expression: string) => {
  try {
    const parsedExpression = pipe(
      parseToPrimaryTokens,
      classifySymbols,
      buildComplexUnits,
      removeSpaceTokens,
      buildSubexpressions,
      buildFunctions,
      validateTokensList,
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
