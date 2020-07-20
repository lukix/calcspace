import {
  unitToString,
  translateToBaseUnits,
  calculateEffectiveUnitMultiplier,
} from '../../mathParser';
import { unitsMap } from '../constants';

const convertToDesiredUnit = ({ number, unit }, desiredUnit) => {
  const desiredUnitInBaseUnits = translateToBaseUnits(desiredUnit, unitsMap);
  const unitString = unitToString(translateToBaseUnits(unit, unitsMap));
  const desiredUnitString = unitToString(desiredUnitInBaseUnits);
  if (unitString !== desiredUnitString) {
    throw new Error(`"${unitString}" cannot be converted to "${unitToString(desiredUnit)}"`);
  }
  const unitMultiplier = calculateEffectiveUnitMultiplier(unit, unitsMap);
  const desiredUnitMultiplier = calculateEffectiveUnitMultiplier(desiredUnit, unitsMap);
  const multiplier = unitMultiplier / desiredUnitMultiplier;
  return { number: number * multiplier, unit: desiredUnit };
};

export default convertToDesiredUnit;
