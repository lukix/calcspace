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
    {
      it: 'should show result in default unit',
      code: `
        10kN / 5m^2
      `,
      expectedResult: `
        10kN / 5m^2 = 2000Pa
      `,
    },
    {
      it: 'should show result in default unit when declaring varaible',
      code: `
        energy = 500N * 3m
      `,
      expectedResult: `
        energy = 500N * 3m = 1500J
      `,
    },
    {
      it: 'should allow specifying result unit',
      code: `
        10kN / 5m^2 = ?kPa
      `,
      expectedResult: `
        10kN / 5m^2 = ?kPa = 2kPa
      `,
    },
    {
      it: 'should allow specifying result unit when declaring varaible',
      code: `
        energy = 500N * 3m = ?N*m
      `,
      expectedResult: `
        energy = 500N * 3m = ?N*m = 1500N*m
      `,
    },
    {
      it: 'should always show result when using question mark notation',
      code: `
        5m = ?m
      `,
      expectedResult: `
        5m = ?m = 5m
      `,
    },
    {
      it: 'should display result unit it the same notation as specified',
      code: `
        5cm*m = ?m*cm
      `,
      expectedResult: `
        5cm*m = ?m*cm = 5m*cm
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
