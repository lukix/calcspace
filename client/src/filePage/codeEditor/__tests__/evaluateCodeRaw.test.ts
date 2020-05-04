import evaluateCode from '../evaluateCode';
import evaluatedCodeToString from '../evaluatedCodeToString';
import { trimIndentation } from '../testUtils';

describe('evaluateCode - raw result test', () => {
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
  ].forEach((testCaseData) => {
    it(testCaseData.it, () => {
      // when
      const result = evaluatedCodeToString(evaluateCode(testCaseData.code));

      // then
      expect(trimIndentation(result)).toEqual(trimIndentation(testCaseData.expectedResult));
    });
  });
});
