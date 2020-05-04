import factorial from 'math-factorial';

const createUnitlessFunction = (func) => ({ number, unit }) => {
  if (unit.length !== 0) {
    throw new Error(`Function doesn't accept values with units`);
  }
  return { number: func(number), unit };
};

export const functions = {
  sqrt: (value) => ({
    number: Math.sqrt(value.number),
    unit: value.unit.map((unit) => ({ ...unit, power: unit.power / 2 })),
  }),
  log: createUnitlessFunction(Math.log),
  sin: createUnitlessFunction(Math.sin),
  cos: createUnitlessFunction(Math.cos),
  tan: createUnitlessFunction(Math.tan),
  asin: createUnitlessFunction(Math.asin),
  acos: createUnitlessFunction(Math.acos),
  atan: createUnitlessFunction(Math.atan),
  factorial: createUnitlessFunction(factorial),
};

export const constants = {
  PI: { number: Math.PI, unit: [] },
};

type UnitMapTuple = [
  string,
  { multiplier: number; baseUnits: Array<{ unit: string; power: number }> }
];

const reverseConversionPriorityList = [
  's',
  'm',
  'kg',
  'A',
  'K',
  'mol',
  'cd',
  // TODO: Other SI secondary units
];

const getUnitsWithPrefixes = (symbol: string, baseUnits): Array<UnitMapTuple> => [
  [`G${symbol}`, { multiplier: 1e9, baseUnits }],
  [`M${symbol}`, { multiplier: 1e6, baseUnits }],
  [`k${symbol}`, { multiplier: 1e3, baseUnits }],
  [`${symbol}`, { multiplier: 1, baseUnits }],
  [`m${symbol}`, { multiplier: 1e-3, baseUnits }],
  [`u${symbol}`, { multiplier: 1e-6, baseUnits }],
  [`n${symbol}`, { multiplier: 1e-9, baseUnits }],
];

const units: Array<UnitMapTuple> = [
  // Base units:
  ...getUnitsWithPrefixes('s', [{ unit: 's', power: 1 }]),
  ...getUnitsWithPrefixes('m', [{ unit: 'm', power: 1 }]),
  ['kg', { multiplier: 1, baseUnits: [{ unit: 'kg', power: 1 }] }],
  ['A', { multiplier: 1, baseUnits: [{ unit: 'A', power: 1 }] }],
  ['K', { multiplier: 1, baseUnits: [{ unit: 'K', power: 1 }] }],
  ['mol', { multiplier: 1, baseUnits: [{ unit: 'mol', power: 1 }] }],
  ['cd', { multiplier: 1, baseUnits: [{ unit: 'cd', power: 1 }] }],

  // Other units:
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
];

export const unitsMap = new Map(units);
