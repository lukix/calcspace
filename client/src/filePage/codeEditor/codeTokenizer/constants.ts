import factorial from 'math-factorial';
import { EvaluationError } from '../mathParser';

const createUnitlessFunction = (func, functionName) => ({ number, unit }) => {
  if (unit.length !== 0) {
    throw new EvaluationError(`Function "${functionName}" doesn't accept values with units`);
  }
  return { number: func(number), unit };
};

export const functions = {
  sqrt: (value) => ({
    number: Math.sqrt(value.number),
    unit: value.unit.map((unit) => ({ ...unit, power: unit.power / 2 })),
  }),
  log: createUnitlessFunction(Math.log, 'log'),
  sin: createUnitlessFunction(Math.sin, 'sin'),
  cos: createUnitlessFunction(Math.cos, 'cos'),
  tan: createUnitlessFunction(Math.tan, 'tan'),
  asin: createUnitlessFunction(Math.asin, 'asin'),
  acos: createUnitlessFunction(Math.acos, 'acos'),
  atan: createUnitlessFunction(Math.atan, 'atan'),
  factorial: createUnitlessFunction(factorial, 'factorial'),
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

  // "Convinient" units:
  ['min', { multiplier: 60, baseUnits: [{ unit: 's', power: 1 }] }],
  ['h', { multiplier: 3600, baseUnits: [{ unit: 's', power: 1 }] }],

  ['Gt', { multiplier: 1e12, baseUnits: [{ unit: 'kg', power: 1 }] }],
  ['Mt', { multiplier: 1e9, baseUnits: [{ unit: 'kg', power: 1 }] }],
  ['kt', { multiplier: 1e6, baseUnits: [{ unit: 'kg', power: 1 }] }],
  ['t', { multiplier: 1e3, baseUnits: [{ unit: 'kg', power: 1 }] }],
  ['lb', { multiplier: 1e3, baseUnits: [{ unit: 'kg', power: 1 }] }],

  ...getUnitsWithPrefixes('l', [{ unit: 'm', power: 3 }], { baseMultiplier: 1e-3 }),

  ['in', { multiplier: 25.4e-3, baseUnits: [{ unit: 'm', power: 1 }] }],
  ['ft', { multiplier: 12 * 25.4e-3, baseUnits: [{ unit: 'm', power: 1 }] }],
  ['yd', { multiplier: 3 * 12 * 25.4e-3, baseUnits: [{ unit: 'm', power: 1 }] }],
  ['mi', { multiplier: 1609.344, baseUnits: [{ unit: 'm', power: 1 }] }],
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
];

export const unitsMap = new Map(units);
