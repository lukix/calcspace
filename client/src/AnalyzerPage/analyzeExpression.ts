import parseToPrimaryTokens from '../shared/codeEditor/mathParser/parseSteps/parseToPrimaryTokens';
import classifySymbols from '../shared/codeEditor/mathParser/parseSteps/classifySymbols';
import buildComplexUnits from '../shared/codeEditor/mathParser/parseSteps/buildComplexUnits';
import buildSymbolsWithExponentialNotation from '../shared/codeEditor/mathParser/parseSteps/buildSymbolsWithExponentialNotation';
import removeSpaceTokens from '../shared/codeEditor/mathParser/parseSteps/removeSpaceTokens';
import buildSubexpressions from '../shared/codeEditor/mathParser/parseSteps/buildSubexpressions';
import buildFunctions from '../shared/codeEditor/mathParser/parseSteps/buildFunctions';
import validateTokensList from '../shared/codeEditor/mathParser/parseSteps/validateTokensList';
import buildPrecedenceHierarchy from '../shared/codeEditor/mathParser/parseSteps/buildPrecedenceHierarchy';

const analyzeExpression = (expression) => {
  const steps = [
    parseToPrimaryTokens,
    classifySymbols,
    buildComplexUnits,
    buildSymbolsWithExponentialNotation,
    removeSpaceTokens,
    buildSubexpressions,
    buildFunctions,
    validateTokensList,
    buildPrecedenceHierarchy,
  ];

  const initialReducerValue: {
    latestResult: any;
    results: { stepName: string; result: any[]; error: any }[];
    failed: boolean;
  } = {
    latestResult: expression,
    results: [],
    failed: false,
  };

  const { results } = steps.reduce((acc, currentFunction) => {
    if (acc.failed) {
      return {
        ...acc,
        results: [
          ...acc.results,
          {
            stepName: currentFunction.name,
            result: [],
            error: 'Skipped due to an error in one of the previous steps',
          },
        ],
      };
    }
    try {
      const newResult = currentFunction(acc.latestResult);
      return {
        ...acc,
        latestResult: newResult,
        results: [
          ...acc.results,
          { stepName: currentFunction.name, result: newResult, error: null },
        ],
      };
    } catch (error) {
      return {
        ...acc,
        results: [...acc.results, { stepName: currentFunction.name, result: [], error }],
        failed: true,
      };
    }
  }, initialReducerValue);

  const tokenResults = results.slice(0, results.length - 1);
  const precedenceHierarchy = results[results.length - 1];

  return { tokenResults, precedenceHierarchy };
};

export default analyzeExpression;
