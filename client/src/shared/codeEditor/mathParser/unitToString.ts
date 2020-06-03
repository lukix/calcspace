const sortBySymbol = (unitObjects) =>
  [...unitObjects].sort((unitObjA, unitObjB) => unitObjA.unit.localeCompare(unitObjB.unit));

const unitToString = (unitObjects: Array<{ unit: string; power: number }>): string => {
  const unitsWithPositivePowers = sortBySymbol(unitObjects.filter(({ power }) => power > 0));
  const unitsWithNegativePowers = sortBySymbol(unitObjects.filter(({ power }) => power < 0));

  if (unitsWithPositivePowers.length > 0) {
    const positivePowersString = unitsWithPositivePowers
      .map(({ unit, power }) => (power === 1 ? unit : `${unit}^${power}`))
      .join('*');
    const negativePowersString = unitsWithNegativePowers
      .map(({ unit, power }) => (Math.abs(power) === 1 ? unit : `${unit}^${Math.abs(power)}`))
      .join('/');

    return `${positivePowersString}${negativePowersString && `/${negativePowersString}`}`;
  }

  return unitsWithNegativePowers.map(({ unit, power }) => `${unit}^${power}`).join('*');
};

export default unitToString;
