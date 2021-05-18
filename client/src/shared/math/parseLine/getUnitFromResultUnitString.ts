import { parseUnits, isValidUnit } from '../expressionParser';

const getUnitFromResultUnitString = (resultUnitString) => {
  const trimmedResultUnitString = resultUnitString.trim();

  if (trimmedResultUnitString.replace(/\s/g) !== trimmedResultUnitString) {
    return { unit: null, error: 'Encountered unexpected whitespaces' };
  }
  if (!trimmedResultUnitString.split('').includes(']')) {
    return {
      unit: null,
      error: 'Found opening square bracket "[" without a closing one "]"',
    };
  }
  if (!trimmedResultUnitString.split('').includes('[')) {
    return {
      unit: null,
      error: 'Found closing square bracket "]" without an opening one "["',
    };
  }
  if (
    trimmedResultUnitString[0] !== '[' &&
    trimmedResultUnitString[trimmedResultUnitString.length - 1] !== ']'
  ) {
    return {
      unit: null,
      error: 'There must not be any characters before or after square brackets',
    };
  }
  const unitString = trimmedResultUnitString.substring(1, trimmedResultUnitString.length - 1);
  if (!isValidUnit(unitString)) {
    return { unit: null, error: 'Invalid desired result unit' };
  }

  return { unit: parseUnits(unitString), error: null };
};

export default getUnitFromResultUnitString;
