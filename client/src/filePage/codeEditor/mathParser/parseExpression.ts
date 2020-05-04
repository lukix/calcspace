import pipe from 'ramda.pipe';
import parseToPrimaryTokens from './parseSteps/parseToPrimaryTokens';
import classifySymbols from './parseSteps/classifySymbols';
import buildSubexpressions from './parseSteps/buildSubexpressions';
import buildFunctions from './parseSteps/buildFunctions';
import validateTokensList from './parseSteps/validateTokensList';
import buildPrecedenceHierarchy from './parseSteps/buildPrecedenceHierarchy';
import buildComplexUnits from './parseSteps/buildComplexUnits';
import tokens from './tokens';

const removeSpaceTokens = (tokensList) => tokensList.filter((token) => token.type !== tokens.SPACE);

const parseExpression = (expression: string) => {
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

export default parseExpression;
