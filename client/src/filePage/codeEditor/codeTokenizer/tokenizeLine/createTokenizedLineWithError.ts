import { tokens } from '../constants';

const createTokenizedLineWithError = ({
  values,
  lineString,
  errorMessage,
  start = null,
  end = null,
}: {
  values: any;
  lineString: string;
  errorMessage: string;
  start?: number | null;
  end?: number | null;
}) => {
  const errorSourceStart = start === null ? 0 : start;
  const errorSourceEnd = end === null ? lineString.length : end;
  return {
    values,
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
