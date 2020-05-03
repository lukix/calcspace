export const unitToString = (unitObjects: Array<{ unit: string; power: number }>): string => {
  return [...unitObjects]
    .sort((unitObjA, unitObjB) => unitObjA.unit.localeCompare(unitObjB.unit))
    .map(({ unit, power }) => `${unit}^${power}`)
    .join('');
};

export const mergeDuplicatedUnits = (unitObjects: Array<{ unit: string; power: number }>) => {
  const unitSymbols = [...new Set(unitObjects.map(({ unit }) => unit))];
  return unitSymbols.map((unitSymbol) => {
    const power = unitObjects
      .filter(({ unit }) => unit === unitSymbol)
      .map(({ power }) => power)
      .reduce((acc, curr) => acc + curr);
    return { unit: unitSymbol, power };
  });
};

const parseUnits = (unitsString: string): Array<{ unit: string; power: number }> => {
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
  return mergeDuplicatedUnits(unitObjects);
};

export default parseUnits;
