const FINDING_MISTAKES = `m = 10kg
v = 7.2km/h
E = (m * v`;

const suffix = ') / 2 = [J]';

const defaultDelay = 100;

export default [
  { value: FINDING_MISTAKES + suffix, delay: 3000 },
  { value: FINDING_MISTAKES + ' ' + suffix, delay: defaultDelay },
  { value: FINDING_MISTAKES + ' ^' + suffix, delay: defaultDelay },
  { value: FINDING_MISTAKES + ' ^ ' + suffix, delay: defaultDelay },
  { value: FINDING_MISTAKES + ' ^ 2' + suffix, delay: 3000 },
  { value: FINDING_MISTAKES + ' ^ ' + suffix, delay: defaultDelay },
  { value: FINDING_MISTAKES + ' ^' + suffix, delay: defaultDelay },
  { value: FINDING_MISTAKES + ' ' + suffix, delay: defaultDelay },
];
