const validateSplittedParts = (partsSplittedByEqualSigns) => {
  if (partsSplittedByEqualSigns.length > 3) {
    return {
      message: 'Too many equal signs',
      start:
        partsSplittedByEqualSigns[0].length +
        1 +
        partsSplittedByEqualSigns[1].length +
        1 +
        partsSplittedByEqualSigns[2].length,
      end: null,
    };
  }
  if (
    partsSplittedByEqualSigns.length === 3 &&
    !(partsSplittedByEqualSigns[2].includes('[') && partsSplittedByEqualSigns[2].includes(']'))
  ) {
    return {
      message: 'Expected square brackets [...] after last "="',
      start: partsSplittedByEqualSigns[0].length + partsSplittedByEqualSigns[1].length + 2,
      end: null,
    };
  }
};

export default validateSplittedParts;
