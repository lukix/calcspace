export class ParserError extends Error {
  isParserError = true;
  startCharIndex: number | null = null;
  endCharIndex: number | null = null;

  constructor(message, { start, end }: { start?: number; end?: number } = {}) {
    super(message);
    this.startCharIndex = start === undefined ? null : start;
    this.endCharIndex = end === undefined ? null : end;
  }
}

export class EvaluationError extends Error {
  isEvaluationError = true;
}
