import tokenizeCode from '../tokenizeCode';
import tokenizedCodeToString from '../tokenizedCodeToString';
import { trimIndentation } from '../testUtils';

describe('tokenizeCode - raw result test', () => {
  [
    {
      it: 'should respect operators precedence',
      code: `
        a = 5
        b = 2

        c = a + b * 2
      `,
      expectedResult: `
        a = 5
        b = 2

        c = a + b * 2 = 9
      `,
    },
    {
      it: 'should not treat symbols after space as units',
      code: `
        a = 5
        10kg / a
      `,
      expectedResult: `
        a = 5
        10kg / a = 2kg
      `,
    },
    {
      it: 'should support comments',
      code: `
        a = 3
        // a = 5
        a
      `,
      expectedResult: `
        a = 3
        // a = 5
        a = 3
      `,
    },
  ].forEach((testCaseData) => {
    it(testCaseData.it, () => {
      // when
      const result = tokenizedCodeToString(tokenizeCode(testCaseData.code));

      // then
      expect(trimIndentation(result)).toEqual(trimIndentation(testCaseData.expectedResult));
    });
  });
});
