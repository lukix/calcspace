import { unitToString } from '../expressionParser';
import formatNumber from './formatNumber';

const formatValueWithUnit = ({ number, unit }, exponentialNotation) => {
  const { numberString, exponentString } = formatNumber(number, exponentialNotation);
  return {
    numberString,
    exponentString,
    unitString: unitToString(unit),
  };
};

export default formatValueWithUnit;
