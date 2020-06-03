const calculateEffectiveUnitMultiplier = (parsedSymbolUnits, unitsMap) => {
  const multipliers = parsedSymbolUnits.map(({ unit, power }) => {
    return unitsMap.get(unit).multiplier ** power;
  });
  return multipliers.reduce((acc, curr) => acc * curr);
};

export default calculateEffectiveUnitMultiplier;
