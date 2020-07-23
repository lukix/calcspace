const formatNumber = (number: number, exponentialNotation: boolean) => {
  if (!Number.isFinite(number)) {
    return { numberString: `${number}`, exponentString: '' };
  }
  const absoluteNumber = Math.abs(number);
  if (
    exponentialNotation &&
    (absoluteNumber >= 1e4 || (absoluteNumber < 1e-4 && absoluteNumber > 0))
  ) {
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
