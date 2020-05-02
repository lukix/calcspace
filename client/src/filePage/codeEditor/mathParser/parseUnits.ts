const parseUnits = (unitsString) => {
  const multiplicationItems = unitsString.split('*');
  const multiplicationItemsWithDivisions = multiplicationItems.map((item) => item.split('/'));
  const unitObjects = multiplicationItemsWithDivisions
    .map((divisionItems) => {
      const [firstItem, ...restItems] = divisionItems.map((item) => {
        const [unit, power = '1'] = item.split('^');
        return { unit, power: Number(power) };
      });
      return [firstItem, ...restItems.map((item) => ({ ...item, power: -item.power }))];
    })
    .flat();
  const unitSymbols = [...new Set(unitObjects.map(({ unit }) => unit))];
  return unitSymbols.map((unitSymbol) => {
    const power = unitObjects
      .filter(({ unit }) => unit === unitSymbol)
      .map(({ power }) => power)
      .reduce((acc, curr) => acc + curr);
    return { unit: unitSymbol, power };
  });
};

export default parseUnits;
