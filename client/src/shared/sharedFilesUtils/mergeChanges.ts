import * as diff from 'diff';

const changeTypes = {
  ADDED: 'ADDED',
  REMOVED: 'REMOVED',
  NO_CHANGE: 'NO_CHANGE',
};

const getChangeType = (fragment) => {
  if (fragment.added) {
    return changeTypes.ADDED;
  }
  if (fragment.removed) {
    return changeTypes.REMOVED;
  }
  return changeTypes.NO_CHANGE;
};

const classifyEachCharChange = (changeFragments) =>
  changeFragments.reduce(
    (chars, currentFragment) => [
      ...chars,
      ...currentFragment.value
        .split('')
        .map((char) => ({ char, changeType: getChangeType(currentFragment) })),
    ],
    []
  );

const mergeChanges = (commonVersionText, currentText, incomingText) => {
  const currentTextDiff = diff.diffChars(commonVersionText, currentText);
  const incomingTextDiff = diff.diffChars(commonVersionText, incomingText);

  const currentDiffChars = classifyEachCharChange(currentTextDiff);
  const incomingDiffChars = classifyEachCharChange(incomingTextDiff);

  let currentDiffIndex = 0;
  let incomingDiffIndex = 0;
  let result = '';
  while (
    currentDiffIndex < currentDiffChars.length ||
    incomingDiffIndex < incomingDiffChars.length
  ) {
    const currentChar = currentDiffChars[currentDiffIndex];
    const incomingChar = incomingDiffChars[incomingDiffIndex];
    if (
      currentChar?.changeType === incomingChar?.changeType &&
      (currentChar?.changeType !== changeTypes.ADDED || currentChar?.char === incomingChar?.char)
    ) {
      if (currentChar?.changeType !== changeTypes.REMOVED) {
        result += currentChar.char;
      }
      currentDiffIndex += 1;
      incomingDiffIndex += 1;
      continue;
    }
    if (incomingChar?.changeType === changeTypes.ADDED) {
      result += incomingChar.char;
      incomingDiffIndex += 1;
      continue;
    }
    if (currentChar?.changeType === changeTypes.ADDED) {
      result += currentChar.char;
      currentDiffIndex += 1;
      continue;
    }

    currentDiffIndex += 1;
    incomingDiffIndex += 1;
  }

  return result;
};

export default mergeChanges;
