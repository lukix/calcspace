export class ParserError extends Error {
  isParserError = true;
}

export class EvaluationError extends Error {
  isEvaluationError = true;
}
