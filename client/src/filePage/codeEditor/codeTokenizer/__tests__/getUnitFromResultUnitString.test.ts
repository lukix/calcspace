import getUnitFromResultUnitString from '../getUnitFromResultUnitString';

describe('getUnitFromResultUnitString', () => {
  it('should return unit based on result unit string', () => {
    // given
    const resultUnitString = '[kg]';

    // when
    const { unit, error } = getUnitFromResultUnitString(resultUnitString);

    // then
    expect(unit).toEqual([{ unit: 'kg', power: 1 }]);
    expect(error).toEqual(null);
  });

  it('should not return an error when there are leading and trailing spaces', () => {
    // given
    const resultUnitString = '  [kg]  ';

    // when
    const { error } = getUnitFromResultUnitString(resultUnitString);

    // then
    expect(error).toEqual(null);
  });

  it('should return an error when there are spaces in between characters', () => {
    // given
    const resultUnitString = '[ kg]';

    // when
    const { error } = getUnitFromResultUnitString(resultUnitString);

    // then
    expect(error).not.toEqual(null);
  });

  it('should return an error when there are characters before square brackets', () => {
    // given
    const resultUnitString = 'm[kg]';

    // when
    const { error } = getUnitFromResultUnitString(resultUnitString);

    // then
    expect(error).not.toEqual(null);
  });
  it('should return an error when there are characters after square brackets', () => {
    // given
    const resultUnitString = '[m]kg';

    // when
    const { error } = getUnitFromResultUnitString(resultUnitString);

    // then
    expect(error).not.toEqual(null);
  });

  it('should return an error when the unit has invalid characters', () => {
    // given
    const resultUnitString = '[kg+mg]';

    // when
    const { error } = getUnitFromResultUnitString(resultUnitString);

    // then
    expect(error).not.toEqual(null);
  });

  it('should return an error when the unit has adjacent operators', () => {
    // given
    const resultUnitString = '[kg/*m]';

    // when
    const { error } = getUnitFromResultUnitString(resultUnitString);

    // then
    expect(error).not.toEqual(null);
  });

  it('should return unit based on complex result unit string for', () => {
    // given
    const resultUnitString = '[kg*N^2/m/s]';

    // when
    const { unit, error } = getUnitFromResultUnitString(resultUnitString);

    // then
    expect(unit).toEqual([
      { unit: 'kg', power: 1 },
      { unit: 'N', power: 2 },
      { unit: 'm', power: -1 },
      { unit: 's', power: -1 },
    ]);
    expect(error).toEqual(null);
  });
});
