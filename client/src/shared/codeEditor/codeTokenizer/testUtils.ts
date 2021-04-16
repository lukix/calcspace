export const trimIndentation = (str) =>
  str
    .split('\n')
    .map((line) => line.trimStart())
    .join('\n')
    .slice(1, -1);
