import translateToBaseUnits from '../translateToBaseUnits';

const unitsMap = new Map([
  [
    'm',
    {
      multiplier: 1,
      baseUnits: [{ unit: 'm', power: 1 }],
    },
  ],
  [
    'J',
    {
      multiplier: 1,
      baseUnits: [
        { unit: 'm', power: 2 },
        { unit: 'kg', power: 1 },
        { unit: 's', power: -2 },
      ],
    },
  ],
]);

describe('translateToBaseUnits', () => {
  it('should correctly translate units to base units', () => {
    // given
    const units = [{ unit: 'J', power: 2 }];

    // when
    const baseUnits = translateToBaseUnits(units, unitsMap);

    // then
    expect(baseUnits).toEqual([
      { unit: 'm', power: 4 },
      { unit: 'kg', power: 2 },
      { unit: 's', power: -4 },
    ]);
  });

  it('should aggregate powers of the same unit', () => {
    // given
    const units = [
      { unit: 'J', power: 1 },
      { unit: 'm', power: 1 },
    ];

    // when
    const baseUnits = translateToBaseUnits(units, unitsMap);

    // then
    expect(baseUnits).toEqual([
      { unit: 'm', power: 3 },
      { unit: 'kg', power: 1 },
      { unit: 's', power: -2 },
    ]);
  });
});
