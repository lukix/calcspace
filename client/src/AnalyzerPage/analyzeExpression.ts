import parseToPrimaryTokens from '../shared/codeEditor/mathParser/parseSteps/parseToPrimaryTokens';
import classifySymbols from '../shared/codeEditor/mathParser/parseSteps/classifySymbols';
import buildComplexUnits from '../shared/codeEditor/mathParser/parseSteps/buildComplexUnits';
import buildSymbolsWithExponentialNotation from '../shared/codeEditor/mathParser/parseSteps/buildSymbolsWithExponentialNotation';
import removeSpaceTokens from '../shared/codeEditor/mathParser/parseSteps/removeSpaceTokens';
import buildSubexpressions from '../shared/codeEditor/mathParser/parseSteps/buildSubexpressions';
import buildFunctions from '../shared/codeEditor/mathParser/parseSteps/buildFunctions';
import validateTokensList from '../shared/codeEditor/mathParser/parseSteps/validateTokensList';
import buildPrecedenceHierarchy from '../shared/codeEditor/mathParser/parseSteps/buildPrecedenceHierarchy';

const legendA = [
  { token: { type: 'SYMBOL', value: '' }, label: `{ type: 'SYMBOL', ... }` },
  { token: { type: 'OPERATOR', value: '' }, label: `{ type: 'OPERATOR', ... }` },
  { token: { type: 'SPACE', value: '' }, label: `{ type: 'SPACE', ... }` },
];

const legendB = [
  {
    token: { type: 'SYMBOL', symbolType: 'VARIABLE', value: '' },
    label: `{ type: 'SYMBOL', symbolType: 'VARIABLE', ... }`,
  },
  {
    token: { type: 'SYMBOL', symbolType: 'NUMERIC', value: '' },
    label: `{ type: 'SYMBOL', symbolType: 'NUMERIC', ... }`,
  },
  {
    token: { type: 'SYMBOL', symbolType: 'NUMERIC_WITH_UNIT', value: '' },
    label: `{ type: 'SYMBOL', symbolType: 'NUMERIC_WITH_UNIT', ... }`,
  },
  { token: { type: 'OPERATOR', value: '' }, label: `{ type: 'OPERATOR', ... }` },
  { token: { type: 'SPACE', value: '' }, label: `{ type: 'SPACE', ... }` },
];

const legendC = [
  {
    token: { type: 'SYMBOL', symbolType: 'VARIABLE', value: '' },
    label: `{ type: 'SYMBOL', symbolType: 'VARIABLE', ... }`,
  },
  {
    token: { type: 'SYMBOL', symbolType: 'NUMERIC', value: '' },
    label: `{ type: 'SYMBOL', symbolType: 'NUMERIC', ... }`,
  },
  {
    token: { type: 'SYMBOL', symbolType: 'NUMERIC_WITH_UNIT', value: '' },
    label: `{ type: 'SYMBOL', symbolType: 'NUMERIC_WITH_UNIT', ... }`,
  },
  { token: { type: 'OPERATOR', value: '' }, label: `{ type: 'OPERATOR', ... }` },
];

const legendD = [
  ...legendC,
  {
    token: { type: 'SUBEXPRESSION', value: '' },
    label: `{ type: 'SUBEXPRESSION', ... }`,
  },
];

const legendE = [
  ...legendD,
  {
    token: { type: 'FUNCTION', name: '', arguments: [[]], value: '' },
    label: `{ type: 'FUNCTION', ... }`,
  },
];

const analyzeExpression = (expression) => {
  const steps = [
    {
      func: parseToPrimaryTokens,
      description: `Characters in the original string are mapped into tokens.
        Each token has information about its position in the original string (for error highlighting),
        value and type (SYMBOL, OPERATOR or SPACE).`,
      legend: legendA,
    },
    {
      func: classifySymbols,
      description: `Each symbol token is classified into one of the three categories:
        VARIABLE, NUMERIC or NUMERIC_WITH_UNIT.`,
      legend: legendB,
    },
    {
      func: buildComplexUnits,
      description: `Sequences of tokens: NUMERIC_WITH_UNIT, OPERATOR, VARIABLE
        are merged into a single NUMERIC_WITH_UNIT token with more complex unit. For example "15m", "/", "s"
        would be combined into a single token "15m/s".`,
      legend: legendB,
    },
    {
      func: buildSymbolsWithExponentialNotation,
      description: `"e" is a special symbol which should not be
        treated as a unit. It is used for exponential notation. For example "15e-2" is equivalent to "15*10^(-2)".
        This step changes NUMERIC_WITH_UNIT tokens where the unit is "e" into NUMERIC tokens.`,
      legend: legendB,
    },
    {
      func: removeSpaceTokens,
      description: `SPACE tokens are not significant for the following steps, so they can be removed.`,
      legend: legendC,
    },
    {
      func: buildSubexpressions,
      description: `Tokens between brackets are nested in SUBEXPRESSION tokens.`,
      legend: legendD,
    },
    {
      func: buildFunctions,
      description: `VARIABLE SYMBOL followed by a SUBEXPRESSION make a function.`,
      legend: legendE,
    },
    {
      func: validateTokensList,
      description: `This step looks for incorrect patterns in the token list,
      like for example adjacent operators ("15++3", "4^*2").`,
      legend: legendE,
    },
    {
      func: buildPrecedenceHierarchy,
      description: `This is the final step that prepares a data structure that
      is convenient for evaluation. The flat list of tokens is converted into a 3D array,
      representing a sum of products of powers.`,
      legend: [],
    },
  ];

  const initialReducerValue: {
    latestResult: any;
    results: {
      stepName: string;
      description: string;
      legend: { token: any; label: string }[];
      result: any[];
      error: any;
    }[];
    failed: boolean;
  } = {
    latestResult: expression,
    results: [],
    failed: false,
  };

  const { results } = steps.reduce((acc, currentStep) => {
    if (acc.failed) {
      return {
        ...acc,
        results: [
          ...acc.results,
          {
            stepName: currentStep.func.name,
            description: currentStep.description,
            legend: currentStep.legend,
            result: [],
            error: 'Skipped due to an error in one of the previous steps',
          },
        ],
      };
    }
    try {
      const newResult = currentStep.func(acc.latestResult);
      return {
        ...acc,
        latestResult: newResult,
        results: [
          ...acc.results,
          {
            stepName: currentStep.func.name,
            description: currentStep.description,
            legend: currentStep.legend,
            result: newResult,
            error: null,
          },
        ],
      };
    } catch (error) {
      return {
        ...acc,
        results: [
          ...acc.results,
          {
            stepName: currentStep.func.name,
            description: currentStep.description,
            legend: currentStep.legend,
            result: [],
            error,
          },
        ],
        failed: true,
      };
    }
  }, initialReducerValue);

  const tokenResults = results.slice(0, results.length - 1);
  const precedenceHierarchy = results[results.length - 1];

  return { tokenResults, precedenceHierarchy };
};

export default analyzeExpression;
