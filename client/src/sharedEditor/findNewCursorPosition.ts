const findNewCursorPosition = (diff, cursorPosition) => {
  const { fragments: diffResultWithPositions } = diff.reduce(
    (acc, currentFragment) => {
      return {
        newPosition: acc.newPosition + (!currentFragment.removed ? currentFragment.count : 0),
        originalPosition:
          acc.originalPosition + (!currentFragment.added ? currentFragment.count : 0),
        fragments: [
          ...acc.fragments,
          {
            ...currentFragment,
            originalPosition: acc.originalPosition,
            newPosition: acc.newPosition,
          },
        ],
      };
    },
    { newPosition: 0, originalPosition: 0, fragments: [] }
  );

  const currentFragmentIndex = diffResultWithPositions.findIndex(
    ({ originalPosition, count, added }) =>
      !added && cursorPosition >= originalPosition && cursorPosition <= originalPosition + count
  );

  const currentFragment = diffResultWithPositions[currentFragmentIndex];
  if (currentFragmentIndex === -1) {
    return 0;
  }
  if (currentFragment.removed && currentFragmentIndex > 0) {
    return (
      diffResultWithPositions[currentFragmentIndex - 1].newPosition +
      diffResultWithPositions[currentFragmentIndex - 1].count
    );
  }
  if (currentFragment.removed && currentFragmentIndex === 0) {
    return 0;
  }

  return currentFragment.newPosition + (cursorPosition - currentFragment.originalPosition);
};

export default findNewCursorPosition;
