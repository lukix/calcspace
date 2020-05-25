import { parseUnits } from '../mathParser';

const UNITS_REGEX = /^([A-Za-z]+(\^[1-9]+[0-9]*)?(\/|\*))*([A-Za-z]+(\^[1-9]+[0-9]*)?)$/;

const getUnitFromResultUnitString = (resultUnitString) => {
  const trimmedResultUnitString = resultUnitString.trim();

  if (trimmedResultUnitString.replace(/\s/g) !== trimmedResultUnitString) {
    return { unit: null, error: 'Encountered unexpected whitespaces' };
  }
  if (
    trimmedResultUnitString[0] !== '[' ||
    trimmedResultUnitString[trimmedResultUnitString.length - 1] !== ']'
  ) {
    return {
      unit: null,
      error: 'There must not be any characters before or afrer square brackets',
    };
  }
  const unitString = trimmedResultUnitString.substring(1, trimmedResultUnitString.length - 1);
  if (!unitString.match(UNITS_REGEX)) {
    return { unit: null, error: 'Invalid desired result unit' };
  }

  return { unit: parseUnits(unitString), error: null };
};

export default getUnitFromResultUnitString;
