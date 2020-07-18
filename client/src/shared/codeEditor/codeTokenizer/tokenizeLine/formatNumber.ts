const formatNumber = (number: number, exponentialNotation: boolean) => {
  if (!Number.isFinite(number)) {
    return { numberString: `${number}`, exponentString: '' };
  }
  if (exponentialNotation && (number >= 1e4 || number < 1e-4)) {
    const orderOfMagnitude = Math.floor(Math.log10(Math.abs(number)));
    const numberWithExponentString = `${number}`.split('').includes('e')
      ? `${number}`
      : `${number / 10 ** orderOfMagnitude}e${orderOfMagnitude}`;
    const [numberString, exponentString] = numberWithExponentString.replace('+', '').split('e');
    return { numberString, exponentString };
  }
  return { numberString: `${number}`, exponentString: '' };
};

export default formatNumber;
