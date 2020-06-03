const classifyPartsSplittedByEqualSigns = (parts: Array<string>) => {
  if (parts.length === 1) {
    return { symbolBeforeSanitization: null, expression: parts[0], resultUnitPart: null };
  }
  if (
    parts[parts.length - 1].split('').includes('[') ||
    parts[parts.length - 1].split('').includes(']')
  ) {
    return parts.length === 2
      ? { symbolBeforeSanitization: null, expression: parts[0], resultUnitPart: parts[1] }
      : { symbolBeforeSanitization: parts[0], expression: parts[1], resultUnitPart: parts[2] };
  }
  return { symbolBeforeSanitization: parts[0], expression: parts[1], resultUnitPart: null };
};

export default classifyPartsSplittedByEqualSigns;
