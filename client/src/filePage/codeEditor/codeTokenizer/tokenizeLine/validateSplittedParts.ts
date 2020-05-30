import createTokenizedLineWithError from './createTokenizedLineWithError';

const validateSplittedParts = ({ partsSplittedByEqualSigns, values, lineString }) => {
  if (partsSplittedByEqualSigns.length > 3) {
    return createTokenizedLineWithError({
      values,
      lineString,
      errorMessage: 'Too many equal signs',
      start:
        partsSplittedByEqualSigns[0].length +
        partsSplittedByEqualSigns[1].length +
        partsSplittedByEqualSigns[2].length,
    });
  }
  if (
    partsSplittedByEqualSigns.length === 3 &&
    !(
      partsSplittedByEqualSigns[2].split('').includes('[') &&
      partsSplittedByEqualSigns[2].split('').includes(']')
    )
  ) {
    return createTokenizedLineWithError({
      values,
      lineString,
      errorMessage: 'Expected square brackets [...] after last "="',
      start: partsSplittedByEqualSigns[0].length + partsSplittedByEqualSigns[1].length + 2,
    });
  }
};

export default validateSplittedParts;
