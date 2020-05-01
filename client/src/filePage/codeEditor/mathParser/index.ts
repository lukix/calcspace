import pipe from 'ramda.pipe';
import parseToPrimaryTokens from './parseToPrimaryTokens';
import classifySymbols from './classifySymbols';
import buildSubexpressions from './buildSubexpressions';
import buildFunctions from './buildFunctions';
import validateTokensList from './validateTokensList';
import validateSymbols from './validateSymbols';
import buildPrecedenceHierarchy from './buildPrecedenceHierarchy';

export { default as evaluateParsedExpression } from './evaluateParsedExpression';

const removeSpaceTokens = (tokensList) =>
  tokensList.filter((token) => token.type !== 'SPACE'); // TODO: Use constants

export const parseExpression = (expression: string) => {
  try {
    const parsedExpression = pipe(
      parseToPrimaryTokens,
      classifySymbols, // Classify symbols as variables with units, non-numeric symbols and numeric symbols
      // TODO: Merge variables with units with following operators and symbols
      removeSpaceTokens, // Remove spaces

      // Tests:
      // 5N*m   // single symbol with unit
      // 5N * m // 2 symbols
      // 5N* m  //  2 symbols
      // 5N *m  // 2 symbols
      // 5N*2m  // 2 symbols
      // 5N*2   // 2 symbols

      buildSubexpressions,
      buildFunctions, // TODO: Build out of only variable symbols
      validateTokensList,
      validateSymbols, // TODO: Remove
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
