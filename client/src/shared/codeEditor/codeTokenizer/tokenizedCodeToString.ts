const tokenizedLineToString = (evaluatedLine) => {
  return evaluatedLine.map(({ value }) => value).join('');
};

const tokenizedCodeToString = (evaluatedCode) => {
  return evaluatedCode.map(tokenizedLineToString).join('\n');
};

export default tokenizedCodeToString;
