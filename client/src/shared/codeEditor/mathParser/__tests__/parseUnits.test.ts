import parseUnits from '../parseUnits';

describe('parseUnits', () => {
  it('should correctly parse complex units', () => {
    // given
    const unitsString = 'kg*m^2/s/s^2*N^2*A';

    // when
    const result = parseUnits(unitsString);

    // then
    expect(result).toEqual([
      { unit: 'kg', power: 1 },
      { unit: 'm', power: 2 },
      { unit: 's', power: -3 },
      { unit: 'N', power: 2 },
      { unit: 'A', power: 1 },
    ]);
  });
});
