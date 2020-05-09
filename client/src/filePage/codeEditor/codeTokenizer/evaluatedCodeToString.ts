const evaluatedLineToString = evaluatedLine => {
  return evaluatedLine.map(({ value }) => value).join('');
};

const evaluatedCodeToString = evaluatedCode => {
  return evaluatedCode.map(evaluatedLineToString).join('\n');
};

export default evaluatedCodeToString;
