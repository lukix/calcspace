import findNewCursorPosition from '../findNewCursorPosition';

describe('findNewCursorPosition', () => {
  it('should return correct cursor position when text was added after cursor', () => {
    // given
    const cursorPosition = 5;
    const diff = [
      { value: 'x = 15', count: 6 },
      { value: ' + 3', count: 4 },
    ];
    const expectedNewCursosPosition = 5;

    // when
    const newCursorPosition = findNewCursorPosition(diff, cursorPosition);

    // then
    expect(newCursorPosition).toEqual(expectedNewCursosPosition);
  });

  it('should return correct cursor position when text was added before cursor', () => {
    // given
    const cursorPosition = 5;
    const diff = [
      { value: 'x = ', count: 4 },
      { value: '3 - ', count: 4, added: true },
      { value: '15', count: 2 },
    ];
    const expectedNewCursosPosition = 9;

    // when
    const newCursorPosition = findNewCursorPosition(diff, cursorPosition);

    // then
    expect(newCursorPosition).toEqual(expectedNewCursosPosition);
  });

  it('should return correct cursor position when text was removed before cursor', () => {
    // given
    const cursorPosition = 9;
    const diff = [
      { value: 'x = ', count: 4 },
      { value: '3 - ', count: 4, removed: true },
      { value: '15', count: 2 },
    ];
    const expectedNewCursosPosition = 5;

    // when
    const newCursorPosition = findNewCursorPosition(diff, cursorPosition);

    // then
    expect(newCursorPosition).toEqual(expectedNewCursosPosition);
  });

  it('should return correct cursor position when text was removed after cursor', () => {
    // given
    const cursorPosition = 5;
    const diff = [
      { value: 'x = 3', count: 5 },
      { value: ' - 15', count: 5, removed: true },
    ];
    const expectedNewCursosPosition = 5;

    // when
    const newCursorPosition = findNewCursorPosition(diff, cursorPosition);

    // then
    expect(newCursorPosition).toEqual(expectedNewCursosPosition);
  });

  it('should return correct cursor position when the fragment with cursor was removed', () => {
    // given
    const cursorPosition = 8;
    const diff = [
      { value: 'x = 1', count: 5 },
      { value: ' + 2', count: 4, removed: true },
      { value: ' + 3', count: 4 },
    ];
    const expectedNewCursosPosition = 5;

    // when
    const newCursorPosition = findNewCursorPosition(diff, cursorPosition);

    // then
    expect(newCursorPosition).toEqual(expectedNewCursosPosition);
  });

  it('should return correct cursor position when the fragment with cursor was removed and there is nothing before', () => {
    // given
    const cursorPosition = 8;
    const diff = [
      { value: 'x = 1 + 2', count: 9, removed: true },
      { value: ' + 3', count: 4 },
    ];
    const expectedNewCursosPosition = 0;

    // when
    const newCursorPosition = findNewCursorPosition(diff, cursorPosition);

    // then
    expect(newCursorPosition).toEqual(expectedNewCursosPosition);
  });

  it('should return correct cursor position when there was no change to empty string', () => {
    // given
    const cursorPosition = 0;
    const diff = [];
    const expectedNewCursosPosition = 0;

    // when
    const newCursorPosition = findNewCursorPosition(diff, cursorPosition);

    // then
    expect(newCursorPosition).toEqual(expectedNewCursosPosition);
  });
});
