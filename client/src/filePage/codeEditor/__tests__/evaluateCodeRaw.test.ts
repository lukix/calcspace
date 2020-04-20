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
  ].forEach(testCaseData => {
    it(testCaseData.it, () => {
      // when
      const result = evaluatedCodeToString(evaluateCode(testCaseData.code));

      // then
      expect(trimIndentation(result)).toEqual(
        trimIndentation(testCaseData.expectedResult)
      );
    });
  });
});
