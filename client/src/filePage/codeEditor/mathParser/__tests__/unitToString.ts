import unitToString from '../unitToString';

describe('unitToString', () => {
  it('should correctly stringify units array', () => {
    // given
    const unit = [
      { unit: 'kg', power: -1 },
      { unit: 'm', power: 2 },
      { unit: 's', power: -3 },
      { unit: 'N', power: 2 },
      { unit: 'A', power: 1 },
    ];

    // when
    const unitString = unitToString(unit);

    // then
    expect(unitString).toEqual('A*m^2*N^2/kg/s^3');
  });

  it('should stringify units without negative powers', () => {
    // given
    const unit = [
      { unit: 'kg', power: 1 },
      { unit: 'm', power: 2 },
    ];

    // when
    const unitString = unitToString(unit);

    // then
    expect(unitString).toEqual('kg*m^2');
  });

  it('should stringify units with no positive powers', () => {
    // given
    const unit = [
      { unit: 'kg', power: -1 },
      { unit: 'm', power: -2 },
    ];

    // when
    const unitString = unitToString(unit);

    // then
    expect(unitString).toEqual('kg^-1*m^-2');
  });
});
