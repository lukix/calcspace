export class ParserError extends Error {
  isParserError = true;
  startCharIndex: number | null = null;
  endCharIndex: number | null = null;

  constructor(
    message,
    { start = null, end = null }: { start: number | null; end: number | null } = {
      start: null,
      end: null,
    }
  ) {
    super(message);
    this.startCharIndex = start;
    this.endCharIndex = end;
  }
}

export class EvaluationError extends Error {
  isEvaluationError = true;
}
