const numberToString = (number: number, exponentialNotation: boolean) => {
  if (!Number.isFinite(number)) {
    return `${number}`;
  }
  if (exponentialNotation && (number >= 1e4 || number < 1e-4)) {
    const orderOfMagnitude = Math.floor(Math.log10(Math.abs(number)));
    return `${number}`.split('').includes('e')
      ? `${number}`
      : `${number / 10 ** orderOfMagnitude}e${orderOfMagnitude}`;
  }
  return `${number}`;
};

export default numberToString;
