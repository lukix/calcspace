import { tokens } from '../constants';

const createTokenizedLineWithError = ({
  values,
  customFunctions,
  customFunctionsRaw,
  lineString,
  errorMessage,
  start = null,
  end = null,
}: {
  values: any;
  customFunctions: any;
  customFunctionsRaw?: any;
  lineString: string;
  errorMessage: string;
  start?: number | null;
  end?: number | null;
}) => {
  const isErrorRangeEmpty = start === lineString.length || (start === end && start !== null);
  const errorSourceStart = start === null || isErrorRangeEmpty ? 0 : start;
  const errorSourceEnd = end === null || isErrorRangeEmpty ? lineString.length : end;
  return {
    values,
    customFunctions,
    customFunctionsRaw: customFunctionsRaw || null,
    tokenizedLine: [
      {
        value: lineString.substring(0, errorSourceStart),
        tags: [tokens.NORMAL, tokens.ERROR],
      },
      {
        value: lineString.substring(errorSourceStart, errorSourceEnd),
        tags: [tokens.NORMAL, tokens.ERROR, tokens.ERROR_SOURCE],
      },
      {
        value: lineString.substring(errorSourceEnd),
        tags: [tokens.NORMAL, tokens.ERROR],
      },
      { value: `  Error: ${errorMessage}`, tags: [tokens.VIRTUAL] },
    ].filter(({ value }) => value !== ''),
  };
};

export default createTokenizedLineWithError;
