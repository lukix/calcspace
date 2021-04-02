const CONVERTING_UNITS = `g = 9.81m/s^2
m = 100kg + 45lb
h = 6ft + 3in

// Potential energy:
E = m * g * h = [kJ]`;

const defaultDelay = 100;
const pauseDelay = 3000;

const convertingUnitsFrames = [
  { value: CONVERTING_UNITS, delay: pauseDelay },
  { value: CONVERTING_UNITS.substring(0, CONVERTING_UNITS.length - 1), delay: defaultDelay },
  { value: CONVERTING_UNITS.substring(0, CONVERTING_UNITS.length - 2), delay: defaultDelay },
  { value: CONVERTING_UNITS.substring(0, CONVERTING_UNITS.length - 3), delay: defaultDelay },
  { value: CONVERTING_UNITS.substring(0, CONVERTING_UNITS.length - 3) + 'W', delay: defaultDelay },
  { value: CONVERTING_UNITS.substring(0, CONVERTING_UNITS.length - 3) + 'Wh', delay: defaultDelay },
  { value: CONVERTING_UNITS.substring(0, CONVERTING_UNITS.length - 3) + 'Wh]', delay: pauseDelay },
  { value: CONVERTING_UNITS.substring(0, CONVERTING_UNITS.length - 3) + 'Wh', delay: defaultDelay },
  { value: CONVERTING_UNITS.substring(0, CONVERTING_UNITS.length - 3) + 'W', delay: defaultDelay },
  { value: CONVERTING_UNITS.substring(0, CONVERTING_UNITS.length - 3) + '', delay: defaultDelay },
  { value: CONVERTING_UNITS.substring(0, CONVERTING_UNITS.length - 3) + 'J', delay: defaultDelay },
  { value: CONVERTING_UNITS.substring(0, CONVERTING_UNITS.length - 3) + 'J]', delay: pauseDelay },
  { value: CONVERTING_UNITS.substring(0, CONVERTING_UNITS.length - 3) + 'J', delay: defaultDelay },
  { value: CONVERTING_UNITS.substring(0, CONVERTING_UNITS.length - 3) + '', delay: defaultDelay },
  { value: CONVERTING_UNITS.substring(0, CONVERTING_UNITS.length - 3) + 'k', delay: defaultDelay },
  { value: CONVERTING_UNITS.substring(0, CONVERTING_UNITS.length - 3) + 'kJ', delay: defaultDelay },
];

export default convertingUnitsFrames;
