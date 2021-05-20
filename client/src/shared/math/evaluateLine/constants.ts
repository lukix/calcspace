import pipe from 'ramda.pipe';
import factorial from 'math-factorial';
import { EvaluationError } from '../expressionParser';

const createUnitlessFunction = (func, functionName, isInsideDomain = ({ number }) => true) =>
  pipe(
    disallowUnits(functionName),
    checkDomain(functionName, isInsideDomain),
    applyUnitlessFunction(func)
  );

const disallowUnits = (functionName) => ({ number, unit }) => {
  if (unit.length !== 0) {
    throw new EvaluationError(`Function "${functionName}" doesn't accept values with units`);
  }
  return { number, unit };
};

const checkDomain = (functionName, isInsideDomain) => ({ number, unit }) => {
  if (!isInsideDomain({ number, unit })) {
    throw new EvaluationError(
      `"${functionName}" function received a value which is outside of its domain`
    );
  }
  return { number, unit };
};

const applyUnitlessFunction = (func) => ({ number }) => ({ number: func(number), unit: [] });

export const functions: {
  [name: string]: (value: {
    number: number;
    unit: Array<{ unit: string; power: number }>;
  }) => { number: number; unit: Array<{ unit: string; power: number }> };
} = {
  sqrt: pipe(
    checkDomain('sqrt', ({ number }) => number >= 0),
    (value) => ({
      number: Math.sqrt(value.number),
      unit: value.unit.map((unit) => ({ ...unit, power: unit.power / 2 })),
    })
  ),
  abs: (value) => ({
    number: Math.abs(value.number),
    unit: value.unit,
  }),
  sign: (value) => ({
    number: Math.sign(value.number),
    unit: [],
  }),
  log: createUnitlessFunction(Math.log, 'log', ({ number }) => number > 0),
  sin: createUnitlessFunction(Math.sin, 'sin'),
  cos: createUnitlessFunction(Math.cos, 'cos'),
  tan: createUnitlessFunction(Math.tan, 'tan'),
  asin: createUnitlessFunction(Math.asin, 'asin', ({ number }) => Math.abs(number) <= 1),
  acos: createUnitlessFunction(Math.acos, 'acos', ({ number }) => Math.abs(number) <= 1),
  atan: createUnitlessFunction(Math.atan, 'atan'),
  factorial: createUnitlessFunction(factorial, 'factorial', ({ number }) => number >= 0),
};

export const constants = {
  PI: { number: Math.PI, unit: [] },
};

type UnitMapTuple = [
  string,
  { multiplier: number; baseUnits: Array<{ unit: string; power: number }> }
];

const getUnitsWithPrefixes = (
  symbol: string,
  baseUnits,
  { baseMultiplier = 1 } = {}
): Array<UnitMapTuple> => [
  [`Y${symbol}`, { multiplier: 1e24 * baseMultiplier, baseUnits }],
  [`Z${symbol}`, { multiplier: 1e21 * baseMultiplier, baseUnits }],
  [`E${symbol}`, { multiplier: 1e18 * baseMultiplier, baseUnits }],
  [`P${symbol}`, { multiplier: 1e15 * baseMultiplier, baseUnits }],
  [`T${symbol}`, { multiplier: 1e12 * baseMultiplier, baseUnits }],
  [`G${symbol}`, { multiplier: 1e9 * baseMultiplier, baseUnits }],
  [`M${symbol}`, { multiplier: 1e6 * baseMultiplier, baseUnits }],
  [`k${symbol}`, { multiplier: 1e3 * baseMultiplier, baseUnits }],
  [`h${symbol}`, { multiplier: 1e2 * baseMultiplier, baseUnits }],
  [`da${symbol}`, { multiplier: 1e1 * baseMultiplier, baseUnits }],
  [`${symbol}`, { multiplier: 1 * baseMultiplier, baseUnits }],
  [`d${symbol}`, { multiplier: 1e-1 * baseMultiplier, baseUnits }],
  [`c${symbol}`, { multiplier: 1e-2 * baseMultiplier, baseUnits }],
  [`m${symbol}`, { multiplier: 1e-3 * baseMultiplier, baseUnits }],
  [`u${symbol}`, { multiplier: 1e-6 * baseMultiplier, baseUnits }],
  [`n${symbol}`, { multiplier: 1e-9 * baseMultiplier, baseUnits }],
  [`p${symbol}`, { multiplier: 1e-12 * baseMultiplier, baseUnits }],
  [`f${symbol}`, { multiplier: 1e-15 * baseMultiplier, baseUnits }],
  [`a${symbol}`, { multiplier: 1e-18 * baseMultiplier, baseUnits }],
  [`z${symbol}`, { multiplier: 1e-21 * baseMultiplier, baseUnits }],
  [`y${symbol}`, { multiplier: 1e-24 * baseMultiplier, baseUnits }],
];

const getUnitsWithPositivePowerPrefixes = (
  symbol: string,
  baseUnits,
  { baseMultiplier = 1 } = {}
): Array<UnitMapTuple> => [
  [`Y${symbol}`, { multiplier: 1e24 * baseMultiplier, baseUnits }],
  [`Z${symbol}`, { multiplier: 1e21 * baseMultiplier, baseUnits }],
  [`E${symbol}`, { multiplier: 1e18 * baseMultiplier, baseUnits }],
  [`P${symbol}`, { multiplier: 1e15 * baseMultiplier, baseUnits }],
  [`T${symbol}`, { multiplier: 1e12 * baseMultiplier, baseUnits }],
  [`G${symbol}`, { multiplier: 1e9 * baseMultiplier, baseUnits }],
  [`M${symbol}`, { multiplier: 1e6 * baseMultiplier, baseUnits }],
  [`k${symbol}`, { multiplier: 1e3 * baseMultiplier, baseUnits }],
  [`${symbol}`, { multiplier: 1 * baseMultiplier, baseUnits }],
];

const getUnitsWithBinaryPrefixes = (
  symbol: string,
  baseUnits,
  { baseMultiplier = 1 } = {}
): Array<UnitMapTuple> => [
  [`Yi${symbol}`, { multiplier: 1024 ** 8 * baseMultiplier, baseUnits }],
  [`Zi${symbol}`, { multiplier: 1024 ** 7 * baseMultiplier, baseUnits }],
  [`Ei${symbol}`, { multiplier: 1024 ** 6 * baseMultiplier, baseUnits }],
  [`Pi${symbol}`, { multiplier: 1024 ** 5 * baseMultiplier, baseUnits }],
  [`Ti${symbol}`, { multiplier: 1024 ** 4 * baseMultiplier, baseUnits }],
  [`Gi${symbol}`, { multiplier: 1024 ** 3 * baseMultiplier, baseUnits }],
  [`Mi${symbol}`, { multiplier: 1024 ** 2 * baseMultiplier, baseUnits }],
  [`ki${symbol}`, { multiplier: 1024 ** 1 * baseMultiplier, baseUnits }],
];

export const units: Array<UnitMapTuple> = [
  // SI base units:
  ...getUnitsWithPrefixes('s', [{ unit: 's', power: 1 }]),
  ...getUnitsWithPrefixes('m', [{ unit: 'm', power: 1 }]),
  ...getUnitsWithPrefixes('g', [{ unit: 'kg', power: 1 }], { baseMultiplier: 1e-3 }),
  ...getUnitsWithPrefixes('A', [{ unit: 'A', power: 1 }]),
  ...getUnitsWithPrefixes('K', [{ unit: 'K', power: 1 }]),
  ...getUnitsWithPrefixes('mol', [{ unit: 'mol', power: 1 }]),
  ...getUnitsWithPrefixes('cd', [{ unit: 'cd', power: 1 }]),

  // SI derived units:
  ...getUnitsWithPrefixes('Hz', [{ unit: 's', power: -1 }]),
  ...getUnitsWithPrefixes('N', [
    { unit: 'm', power: 1 },
    { unit: 'kg', power: 1 },
    { unit: 's', power: -2 },
  ]),
  ...getUnitsWithPrefixes('Pa', [
    { unit: 'm', power: -1 },
    { unit: 'kg', power: 1 },
    { unit: 's', power: -2 },
  ]),
  ...getUnitsWithPrefixes('J', [
    { unit: 'm', power: 2 },
    { unit: 'kg', power: 1 },
    { unit: 's', power: -2 },
  ]),
  ...getUnitsWithPrefixes('W', [
    { unit: 'm', power: 2 },
    { unit: 'kg', power: 1 },
    { unit: 's', power: -3 },
  ]),
  ...getUnitsWithPrefixes('C', [
    { unit: 's', power: 1 },
    { unit: 'A', power: 1 },
  ]),
  ...getUnitsWithPrefixes('V', [
    { unit: 'kg', power: 1 },
    { unit: 'm', power: 2 },
    { unit: 's', power: -3 },
    { unit: 'A', power: -1 },
  ]),
  ...getUnitsWithPrefixes('F', [
    { unit: 'kg', power: -1 },
    { unit: 'm', power: -2 },
    { unit: 's', power: 4 },
    { unit: 'A', power: 2 },
  ]),
  ...getUnitsWithPrefixes('Ohm', [
    { unit: 'kg', power: 1 },
    { unit: 'm', power: 2 },
    { unit: 's', power: -3 },
    { unit: 'A', power: -2 },
  ]),
  ...getUnitsWithPrefixes('S', [
    { unit: 'kg', power: -1 },
    { unit: 'm', power: -2 },
    { unit: 's', power: 3 },
    { unit: 'A', power: 2 },
  ]),
  ...getUnitsWithPrefixes('Wb', [
    { unit: 'kg', power: 1 },
    { unit: 'm', power: 2 },
    { unit: 's', power: -2 },
    { unit: 'A', power: -1 },
  ]),
  ...getUnitsWithPrefixes('T', [
    { unit: 'kg', power: 1 },
    { unit: 's', power: -2 },
    { unit: 'A', power: -1 },
  ]),
  ...getUnitsWithPrefixes('H', [
    { unit: 'kg', power: 1 },
    { unit: 'm', power: 2 },
    { unit: 's', power: -2 },
    { unit: 'A', power: -2 },
  ]),
  ...getUnitsWithPrefixes('lm', [{ unit: 'cd', power: 1 }]),
  ...getUnitsWithPrefixes('lx', [
    { unit: 'cd', power: 1 },
    { unit: 'm', power: -2 },
  ]),
  ...getUnitsWithPrefixes('Bq', [{ unit: 's', power: -1 }]),
  ...getUnitsWithPrefixes('Gy', [
    { unit: 'm', power: 2 },
    { unit: 's', power: -2 },
  ]),
  ...getUnitsWithPrefixes('Sv', [
    { unit: 'm', power: 2 },
    { unit: 's', power: -2 },
  ]),
  ...getUnitsWithPrefixes('kat', [
    { unit: 's', power: -1 },
    { unit: 'mol', power: 1 },
  ]),

  // "Convenient" units:
  ['rad', { multiplier: 1, baseUnits: [] }],
  ['deg', { multiplier: Math.PI / 180, baseUnits: [] }],
  ['%', { multiplier: 0.01, baseUnits: [] }],

  ['min', { multiplier: 60, baseUnits: [{ unit: 's', power: 1 }] }],
  ['h', { multiplier: 3600, baseUnits: [{ unit: 's', power: 1 }] }],

  ['Gt', { multiplier: 1e12, baseUnits: [{ unit: 'kg', power: 1 }] }],
  ['Mt', { multiplier: 1e9, baseUnits: [{ unit: 'kg', power: 1 }] }],
  ['kt', { multiplier: 1e6, baseUnits: [{ unit: 'kg', power: 1 }] }],
  ['t', { multiplier: 1e3, baseUnits: [{ unit: 'kg', power: 1 }] }],
  ['oz', { multiplier: 28.349523125e-3, baseUnits: [{ unit: 'kg', power: 1 }] }],
  ['lb', { multiplier: 0.45359237, baseUnits: [{ unit: 'kg', power: 1 }] }],

  ...getUnitsWithPrefixes('l', [{ unit: 'm', power: 3 }], { baseMultiplier: 1e-3 }),
  ...getUnitsWithPositivePowerPrefixes('b', [{ unit: 'b', power: 1 }], { baseMultiplier: 1 }),
  ...getUnitsWithBinaryPrefixes('b', [{ unit: 'b', power: 1 }], { baseMultiplier: 1 }),
  ...getUnitsWithPositivePowerPrefixes('B', [{ unit: 'b', power: 1 }], { baseMultiplier: 8 }),
  ...getUnitsWithBinaryPrefixes('B', [{ unit: 'b', power: 1 }], { baseMultiplier: 8 }),
  ...getUnitsWithPrefixes(
    'eV',
    [
      { unit: 'm', power: 2 },
      { unit: 'kg', power: 1 },
      { unit: 's', power: -2 },
    ],
    { baseMultiplier: 1.602176634e-19 }
  ),
  ...getUnitsWithPrefixes(
    'Wh',
    [
      { unit: 'm', power: 2 },
      { unit: 'kg', power: 1 },
      { unit: 's', power: -2 },
    ],
    { baseMultiplier: 3600 }
  ),
  ...getUnitsWithPrefixes(
    'Ah',
    [
      { unit: 'A', power: 1 },
      { unit: 's', power: 1 },
    ],
    { baseMultiplier: 3600 }
  ),

  ['in', { multiplier: 25.4e-3, baseUnits: [{ unit: 'm', power: 1 }] }],
  ['ft', { multiplier: 12 * 25.4e-3, baseUnits: [{ unit: 'm', power: 1 }] }],
  ['yd', { multiplier: 3 * 12 * 25.4e-3, baseUnits: [{ unit: 'm', power: 1 }] }],
  ['mi', { multiplier: 1609.344, baseUnits: [{ unit: 'm', power: 1 }] }],

  // Currency units
  ['USD', { multiplier: 1, baseUnits: [{ unit: 'USD', power: 1 }] }],
  ['EUR', { multiplier: 1, baseUnits: [{ unit: 'EUR', power: 1 }] }],
  ['GBP', { multiplier: 1, baseUnits: [{ unit: 'GBP', power: 1 }] }],
  ['PLN', { multiplier: 1, baseUnits: [{ unit: 'PLN', power: 1 }] }],
];

export const unitsApplicableForResult = [
  's',
  'm',
  'kg',
  'A',
  'K',
  'mol',
  'cd',
  'Hz',
  'N',
  'Pa',
  'J',
  'W',
  'C',
  'V',
  'F',
  'Ohm',
  'S',
  'Wb',
  'H',
  'lx',
  'Gy',
  'kat',
  'USD',
  'EUR',
  'GBP',
  'PLN',
];

if ([...new Map(units)].length !== units.length) {
  throw new Error('There are duplicated units!');
}

export const unitsMap = new Map(units);
