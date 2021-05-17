import { tokens } from '../constants';
import createTokenizedLineWithError from './createTokenizedLineWithError';

const ALL_WHITESPACES_REGEX = /\s/g;
const sanitize = (str: string) => str.replace(ALL_WHITESPACES_REGEX, '');

const tokenizeLine = (evaluatedLine, { showResultUnit = true }) => {
  const {
    lineString,
    error,
    isCommented,

    newFunction,

    symbolRawString,
    expressionRawString,
    desiredUnitRawString,
    result,
  } = evaluatedLine;

  if (error) {
    return createTokenizedLineWithError({
      lineString,
      errorMessage: error.message,
      start: error.start,
      end: error.end,
    });
  }

  if (isCommented) {
    return [
      {
        value: lineString,
        tags: [tokens.COMMENT],
      },
    ];
  }

  if (newFunction) {
    return [
      {
        value: lineString,
        tags: [tokens.NORMAL],
      },
    ];
  }

  const isResultEqualToExpression = sanitize(expressionRawString) === result.rawString;
  const showResult: boolean = !isResultEqualToExpression || desiredUnitRawString;

  if (!showResult) {
    return [
      {
        value: lineString,
        tags: [tokens.NORMAL],
      },
    ];
  }

  const resultTokens = result.exponentString
    ? [
        { value: ` = ${result.numberString}·10`, tags: [tokens.VIRTUAL] },
        { value: result.exponentString, tags: [tokens.VIRTUAL, tokens.POWER_ALIGN] },
        ...(result.unitString ? [{ value: result.unitString, tags: [tokens.VIRTUAL] }] : []),
      ]
    : [
        {
          value: ` = ${result.numberString}${result.unitString}`,
          tags: [tokens.VIRTUAL],
        },
      ];

  const normalString = [symbolRawString, expressionRawString]
    .filter((str) => Boolean(str))
    .join('=');

  if (desiredUnitRawString && showResultUnit) {
    return [
      {
        value: normalString,
        tags: [tokens.NORMAL],
      },
      {
        value: `=${desiredUnitRawString}`,
        tags: [tokens.NORMAL, tokens.DESIRED_UNIT],
      },
      ...resultTokens,
    ];
  }
  return [
    {
      value: normalString.trimEnd(),
      tags: [tokens.NORMAL],
    },
    ...resultTokens,
  ];
};

export default tokenizeLine;
