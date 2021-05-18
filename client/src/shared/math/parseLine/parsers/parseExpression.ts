import { parseExpression as parse } from '../../expressionParser';

export class ParseExpressionError {
  message: string;
  start: number;
  end: number;

  constructor(message, start, end) {
    this.message = message;
    this.start = start;
    this.end = end;
  }
}

const parseExpression = (expressionString) => {
  const result = parse(expressionString);
  if (result.isValid) {
    return result.parsedExpression;
  }
  const { errorMessage, startCharIndex, endCharIndex } = result;
  throw new ParseExpressionError(errorMessage, startCharIndex, endCharIndex);
};

export default parseExpression;
