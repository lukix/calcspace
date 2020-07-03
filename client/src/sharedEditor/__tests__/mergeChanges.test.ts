import mergeChanges from '../mergeChanges';

describe('mergeChanges', () => {
  it('should merge non-conflicting changes', () => {
    // given
    const commonVersionText = 'x = 15';
    const currentText = 'x = 15 + 3';
    const incomingText = 'y = 15';
    const expectedResult = 'y = 15 + 3';

    // when
    const mergeResult = mergeChanges(commonVersionText, currentText, incomingText);

    // then
    expect(mergeResult).toEqual(expectedResult);
  });

  it('should accept one change when merging same add changes', () => {
    // given
    const commonVersionText = 'x = 15';
    const currentText = 'x = 15 + 3';
    const incomingText = 'x = 15 + 3';
    const expectedResult = 'x = 15 + 3';

    // when
    const mergeResult = mergeChanges(commonVersionText, currentText, incomingText);

    // then
    expect(mergeResult).toEqual(expectedResult);
  });

  it('should accept both changes when merging conflicting changes', () => {
    // given
    const commonVersionText = 'x = 15';
    const currentText = 'x = 15 + 3';
    const incomingText = 'x = 15 + 8';
    const expectedResult = 'x = 15 + 83';

    // when
    const mergeResult = mergeChanges(commonVersionText, currentText, incomingText);

    // then
    expect(mergeResult).toEqual(expectedResult);
  });

  it('should accept both changes when merging remove and add changes', () => {
    // given
    const commonVersionText = 'x = 15';
    const currentText = 'x = 15 + 3';
    const incomingText = 'x';
    const expectedResult = 'x + 3';

    // when
    const mergeResult = mergeChanges(commonVersionText, currentText, incomingText);

    // then
    expect(mergeResult).toEqual(expectedResult);
  });

  it('should accept either change when merging two identical remove changes', () => {
    // given
    const commonVersionText = '123';
    const currentText = '1';
    const incomingText = '1';
    const expectedResult = '1';

    // when
    const mergeResult = mergeChanges(commonVersionText, currentText, incomingText);

    // then
    expect(mergeResult).toEqual(expectedResult);
  });
});
