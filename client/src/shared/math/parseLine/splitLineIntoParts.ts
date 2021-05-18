import validateSplittedParts from './validateSplittedParts';

export class SplitLineError {
  message: string;
  start: number;
  end: number;

  constructor(message, start, end) {
    this.message = message;
    this.start = start;
    this.end = end;
  }
}

const splitLineIntoParts = (lineString: string) => {
  const parts = lineString.split('=');
  const splittedPartsValidationError = validateSplittedParts(parts);
  if (splittedPartsValidationError) {
    throw new SplitLineError(
      splittedPartsValidationError.message,
      splittedPartsValidationError.start,
      splittedPartsValidationError.end
    );
  }

  if (parts.length === 1) {
    return {
      symbolPart: null,
      expressionPart: { value: parts[0], startIndex: 0 },
      resultUnitPart: null,
    };
  }
  if (parts[parts.length - 1].includes('[') || parts[parts.length - 1].includes(']')) {
    return parts.length === 2
      ? {
          symbolPart: null,
          expressionPart: { value: parts[0], startIndex: 0 },
          resultUnitPart: { value: parts[1], startIndex: lineString.indexOf('=') + 1 },
        }
      : {
          symbolPart: { value: parts[0], startIndex: 0 },
          expressionPart: { value: parts[1], startIndex: lineString.indexOf('=') + 1 },
          resultUnitPart: { value: parts[2], startIndex: lineString.lastIndexOf('=') + 1 },
        };
  }
  return {
    symbolPart: { value: parts[0], startIndex: 0 },
    expressionPart: { value: parts[1], startIndex: lineString.indexOf('=') + 1 },
    resultUnitPart: null,
  };
};

export default splitLineIntoParts;
