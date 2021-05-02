import getUnitFromResultUnitString from '../getUnitFromResultUnitString';

export class ParseResultUnitError {
  message: string;
  start: number;
  end: number;

  constructor(message, start, end) {
    this.message = message;
    this.start = start;
    this.end = end;
  }
}

const parseResultUnit = (resultUnitString) => {
  const { unit, error } = getUnitFromResultUnitString(resultUnitString);
  if (error) {
    throw new ParseResultUnitError(error, 0, resultUnitString.length);
  }
  return unit;
};

export default parseResultUnit;
