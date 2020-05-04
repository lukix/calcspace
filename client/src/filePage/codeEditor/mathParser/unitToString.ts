const unitToString = (unitObjects: Array<{ unit: string; power: number }>): string => {
  return [...unitObjects]
    .sort((unitObjA, unitObjB) => unitObjA.unit.localeCompare(unitObjB.unit))
    .map(({ unit, power }) => (power === 1 ? unit : `${unit}^${power}`))
    .join('*');
};

export default unitToString;
