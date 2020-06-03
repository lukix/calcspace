import { unitToString } from '../../mathParser';
import numberToString from './numberToString';

const valueWithUnitToString = ({ number, unit }, exponentialNotation) =>
  `${numberToString(number, exponentialNotation)}${unitToString(unit)}`;

export default valueWithUnitToString;
