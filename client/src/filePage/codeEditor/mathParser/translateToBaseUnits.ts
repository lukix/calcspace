const aggregateDuplicatedUnits = (
  units: Array<{ unit: string; power: number }>
): Array<{ unit: string; power: number }> => {
  const allUnitSymbols = [...new Set(units.map(({ unit }) => unit))];
  return allUnitSymbols.map((unitSymbol) => ({
    unit: unitSymbol,
    power: units
      .filter(({ unit }) => unit === unitSymbol)
      .reduce((acc, { power }) => acc + power, 0),
  }));
};

const translateToBaseUnits = (units, unitsMap) => {
  const baseUnits = units
    .map(({ unit, power }) => {
      const unitDefinition = unitsMap.get(unit);
      return unitDefinition.baseUnits.map((baseUnit) => ({
        ...baseUnit,
        power: baseUnit.power * power,
      }));
    })
    .flat();
  return aggregateDuplicatedUnits(baseUnits);
};

export default translateToBaseUnits;
