import pipe from 'ramda.pipe';
import tokens from '../tokens';
import symbolTypes from '../symbolTypes';
import { ParserError } from '../errors';

const createNumericSymbol = (value: string) => ({
  type: tokens.SYMBOL,
  value,
  symbolType: symbolTypes.NUMERIC,
  number: Number(value),
});
const createOperator = (value: string) => ({ type: tokens.OPERATOR, value });

const splitPowerElements = (tokensList) => {
  const initialReduceState = { array: [], tempTokens: [] };
  const { array, tempTokens } = tokensList.reduce((acc, currentToken) => {
    if (currentToken.type === tokens.OPERATOR && currentToken.value === '^') {
      if (acc.tempTokens.length > 1) {
        throw new ParserError('Found unexpected number of elements when splitting power elements');
      }
      return {
        array: [...acc.array, ...acc.tempTokens],
        tempTokens: [],
      };
    }
    return {
      array: acc.array,
      tempTokens: [...acc.tempTokens, currentToken],
    };
  }, initialReduceState);
  if (tempTokens.length > 1) {
    throw new ParserError('Found unexpected number of elements when splitting power elements');
  }
  return [...array, ...tempTokens];
};

const splitProductElements = (tokensList) => {
  const createProductElement = (tempTokens, divisionFlag) =>
    divisionFlag
      ? [
          {
            type: tokens.SUBEXPRESSION,
            value: buildPrecedenceHierarchy(tempTokens, false),
          },
          createOperator('^'),
          createNumericSymbol('-1'),
        ]
      : tempTokens;
  const initialReduceState = { array: [], tempTokens: [], divisionFlag: false };
  const { array, tempTokens, divisionFlag } = tokensList.reduce((acc, currentToken) => {
    if (currentToken.type === tokens.OPERATOR && currentToken.value === '*') {
      return {
        ...acc,
        array: [...acc.array, createProductElement(acc.tempTokens, acc.divisionFlag)],
        tempTokens: [],
        divisionFlag: false,
      };
    }
    if (currentToken.type === tokens.OPERATOR && currentToken.value === '/') {
      return {
        ...acc,
        array: [...acc.array, createProductElement(acc.tempTokens, acc.divisionFlag)],
        tempTokens: [],
        divisionFlag: true,
      };
    }
    return {
      ...acc,
      tempTokens: [...acc.tempTokens, currentToken],
    };
  }, initialReduceState);
  return [...array, createProductElement(tempTokens, divisionFlag)];
};

const splitSumElements = (tokensList) => {
  const initialReduceState = { array: [], tempTokens: [] };
  const { array, tempTokens } = tokensList.reduce((acc, currentToken) => {
    if (currentToken.type === tokens.OPERATOR && currentToken.value === '+') {
      return {
        array: [...acc.array, acc.tempTokens],
        tempTokens: [],
      };
    }
    if (currentToken.type === tokens.OPERATOR && currentToken.value === '-') {
      return {
        array: acc.tempTokens.length === 0 ? acc.array : [...acc.array, acc.tempTokens],
        tempTokens: [createNumericSymbol('-1'), createOperator('*')],
      };
    }
    return {
      array: acc.array,
      tempTokens: [...acc.tempTokens, currentToken],
    };
  }, initialReduceState);
  return [...array, tempTokens];
};

const buildPrecedenceHierarchy = (tokensList, processSubexpressions = true) => {
  const tokensListWithResolvedSubexpressions = processSubexpressions
    ? tokensList.map((token) => {
        if (token.type === tokens.SUBEXPRESSION) {
          return {
            ...token,
            value: buildPrecedenceHierarchy(token.value),
          };
        }
        if (token.type === tokens.FUNCTION) {
          return {
            ...token,
            arguments: token.arguments
              .map(argumentSubexpressions => buildPrecedenceHierarchy(argumentSubexpressions)),
          };
        }
        return token;
      })
    : tokensList;

  return pipe(
    splitSumElements,
    (sumElements) => sumElements.map((element) => splitProductElements(element)),
    (sumElements) =>
      sumElements.map((productElements) =>
        productElements.map((element) => splitPowerElements(element))
      )
  )(tokensListWithResolvedSubexpressions);
};

export default buildPrecedenceHierarchy;
