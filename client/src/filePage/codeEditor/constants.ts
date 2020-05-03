// import factorial from 'math-factorial';

export const functions = {
  sqrt: (value) => ({
    number: Math.sqrt(value.number),
    unit: value.unit.map((unit) => ({ ...unit, power: unit.power / 2 })),
  }),
  // TODO
  // log: Math.log,
  // sin: Math.sin,
  // cos: Math.cos,
  // tan: Math.tan,
  // asin: Math.asin,
  // acos: Math.acos,
  // atan: Math.atan,
  // factorial,
};

export const constants = {
  PI: { number: Math.PI, unit: [] },
};

export const unitsMap = new Map([
  ['s', { multiplier: 1, baseUnits: [{ unit: 's', power: 1 }] }],
  ['m', { multiplier: 1, baseUnits: [{ unit: 'm', power: 1 }] }],
  ['kg', { multiplier: 1, baseUnits: [{ unit: 'kg', power: 1 }] }],
  ['A', { multiplier: 1, baseUnits: [{ unit: 'A', power: 1 }] }],
  ['K', { multiplier: 1, baseUnits: [{ unit: 'K', power: 1 }] }],
  ['mol', { multiplier: 1, baseUnits: [{ unit: 'mol', power: 1 }] }],
  ['cd', { multiplier: 1, baseUnits: [{ unit: 'cd', power: 1 }] }],

  ['Gs', { multiplier: 1e9, baseUnits: [{ unit: 's', power: 1 }] }],
  ['Ms', { multiplier: 1e6, baseUnits: [{ unit: 's', power: 1 }] }],
  ['ks', { multiplier: 1e3, baseUnits: [{ unit: 's', power: 1 }] }],
  ['ms', { multiplier: 1e-3, baseUnits: [{ unit: 's', power: 1 }] }],
  ['us', { multiplier: 1e-6, baseUnits: [{ unit: 's', power: 1 }] }],
  ['ns', { multiplier: 1e-9, baseUnits: [{ unit: 's', power: 1 }] }],
  ['min', { multiplier: 60, baseUnits: [{ unit: 's', power: 1 }] }],
  ['h', { multiplier: 3600, baseUnits: [{ unit: 's', power: 1 }] }],

  ['km', { multiplier: 1e3, baseUnits: [{ unit: 'm', power: 1 }] }],

  ['Hz', { multiplier: 1, baseUnits: [{ unit: 's', power: -1 }] }],
  [
    'N',
    {
      multiplier: 1,
      baseUnits: [
        { unit: 'm', power: 1 },
        { unit: 'kg', power: 1 },
        { unit: 's', power: -2 },
      ],
    },
  ],
  [
    'Pa',
    {
      multiplier: 1,
      baseUnits: [
        { unit: 'm', power: -1 },
        { unit: 'kg', power: 1 },
        { unit: 's', power: -2 },
      ],
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
  [
    'W',
    {
      multiplier: 1,
      baseUnits: [
        { unit: 'm', power: 2 },
        { unit: 'kg', power: 1 },
        { unit: 's', power: -3 },
      ],
    },
  ],
  // TODO: C
  // TODO: V
  // TODO: F
  // TODO: Ohm
  // TODO: S
  // TODO: Wb
  // TODO: T
  // TODO: H
  // TODO: lm
  // TODO: lx
  // TODO: Bq
  // TODO: Gy
  // TODO: Sv
  // TODO: Gkat
  // TODO: Gy
]);
