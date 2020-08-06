const COMPLEX_CALCULATIONS = `x = 3
    y = 8 / 2
    sqrt(x^2 + y^2)`;

const getDelay = (char, index, array) => {
  if (index === array.length - 1) {
    return 4000;
  }
  if (char === '\n') {
    return 500;
  }
  return 100;
};

const getNumberOfLines = (str) => str.split('').filter((char) => char === '\n').length + 1;
const getValue = (string, index) => {
  const stringToShow = string.substring(0, index + 1);
  const currentNumberOfLines = getNumberOfLines(stringToShow);
  const targetNumberOfLines = getNumberOfLines(string);
  return `${stringToShow}${Array(targetNumberOfLines - currentNumberOfLines)
    .fill('\n')
    .join('')}`;
};

const prepareFrames = (str) => {
  const sanitizedString = str
    .split('\n')
    .map((s) => s.trim())
    .join('\n');
  const characters = sanitizedString.split('').map((char, index, array) => ({
    value: getValue(sanitizedString, index),
    delay: getDelay(char, index, array),
  }));

  return characters;
};

export default prepareFrames(COMPLEX_CALCULATIONS);
