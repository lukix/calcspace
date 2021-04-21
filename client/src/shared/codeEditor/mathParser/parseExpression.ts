import pipe from 'ramda.pipe';
import parseToPrimaryTokens from './parseSteps/parseToPrimaryTokens';
import classifySymbols from './parseSteps/classifySymbols';
import buildComplexUnits from './parseSteps/buildComplexUnits';
import buildSymbolsWithExponentialNotation from './parseSteps/buildSymbolsWithExponentialNotation';
import removeSpaceTokens from './parseSteps/removeSpaceTokens';
import buildSubexpressions from './parseSteps/buildSubexpressions';
import buildFunctions from './parseSteps/buildFunctions';
import validateTokensList from './parseSteps/validateTokensList';
import buildPrecedenceHierarchy from './parseSteps/buildPrecedenceHierarchy';

const parseExpression = (expression: string) => {
  try {
    const parsedExpression = pipe(
      parseToPrimaryTokens,
      classifySymbols,
      buildComplexUnits,
      buildSymbolsWithExponentialNotation,
      removeSpaceTokens,
      buildSubexpressions,
      buildFunctions,
      validateTokensList,
      buildPrecedenceHierarchy
    )(expression);
    return { parsedExpression, isValid: true };
  } catch (error) {
    if (error.isParserError) {
      return {
        isValid: false,
        errorMessage: error.message,
        startCharIndex: error.startCharIndex,
        endCharIndex: error.endCharIndex,
      };
    }
    console.error(error);
    return { isValid: false, errorMessage: 'Expression cannot be parsed' };
  }
};

export default parseExpression;
