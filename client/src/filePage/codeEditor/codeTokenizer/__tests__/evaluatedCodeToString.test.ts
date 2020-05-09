import evaluatedCodeToString from '../evaluatedCodeToString';
import { trimIndentation } from '../testUtils';

describe('evaluatedCodeToString', () => {
  it('should convert list of token sequences to raw string', () => {
    // given
    const evaluatedCode = [
      [
        { value: '5 + 5', tags: ['NORMAL'] },
        { value: ' = 10', tags: ['VIRTUAL'] },
      ],
      [],
      [{ value: 'some text', tags: ['ERROR'] }],
    ];
    const expectedString = trimIndentation(`
      5 + 5 = 10

      some text
    `);

    // when
    const str = evaluatedCodeToString(evaluatedCode);

    // then
    expect(str).toEqual(expectedString);
  });
});
