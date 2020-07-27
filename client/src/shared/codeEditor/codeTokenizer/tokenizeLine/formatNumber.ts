const adjustPrecision = (number) => {
  const numberString = number.toPrecision(15);
  const [integerPart, decimalPart = ''] = numberString.split('.');
  const trimmedDecimalPart = decimalPart.replace(/0+$/, '');
  if (!trimmedDecimalPart) {
    return integerPart;
  }
  return `${integerPart}.${trimmedDecimalPart}`;
};

const formatNumber = (number: number, exponentialNotation: boolean) => {
  if (!Number.isFinite(number)) {
    return { numberString: adjustPrecision(number), exponentString: '' };
  }
  const absoluteNumber = Math.abs(number);
  if (
    exponentialNotation &&
    (absoluteNumber >= 1e4 || (absoluteNumber < 1e-4 && absoluteNumber > 0))
  ) {
    const orderOfMagnitude = Math.floor(Math.log10(Math.abs(number)));
    const numberWithExponentString = `${number}`.split('').includes('e')
      ? adjustPrecision(number)
      : `${adjustPrecision(number / 10 ** orderOfMagnitude)}e${orderOfMagnitude}`;
    const [numberString, exponentString] = numberWithExponentString.replace('+', '').split('e');
    return { numberString: adjustPrecision(parseFloat(numberString)), exponentString };
  }
  const [numberString, exponentString] = `${number}`.replace('+', '').split('e');
  return { numberString: adjustPrecision(parseFloat(numberString)), exponentString };
};

export default formatNumber;
