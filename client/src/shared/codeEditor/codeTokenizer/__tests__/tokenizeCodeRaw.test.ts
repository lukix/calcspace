import CodeTokenizerWithCache from '../codeTokenizerWithCache';
import tokenizedCodeToString from '../tokenizedCodeToString';
import { trimIndentation } from '../testUtils';

const tokenizeCode = CodeTokenizerWithCache();

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
      it: 'should show result in default unit when declaring variable',
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
        10kN / 5m^2 = [kPa]
      `,
      expectedResult: `
        10kN / 5m^2 = [kPa] = 2kPa
      `,
    },
    {
      it: 'should allow specifying result unit when declaring varaible',
      code: `
        energy = 500N * 3m = [N*m]
      `,
      expectedResult: `
        energy = 500N * 3m = [N*m] = 1500N*m
      `,
    },
    {
      it: 'should always show result when using question mark notation',
      code: `
        5m = [m]
      `,
      expectedResult: `
        5m = [m] = 5m
      `,
    },
    {
      it: 'should display result unit it the same notation as specified',
      code: `
        5cm*m = [m*cm]
      `,
      expectedResult: `
        5cm*m = [m*cm] = 5m*cm
      `,
    },
    {
      it: 'should accept result units with negative powers',
      code: `
        15m/s = [m*s^-1]
      `,
      options: { exponentialNotation: true },
      expectedResult: `
        15m/s = [m*s^-1] = 15m*s^-1
      `,
    },
    {
      it: 'should show full number when exponential notation is off',
      code: `
        1000000 * 2
        -1000000 * 2
      `,
      options: { exponentialNotation: false },
      expectedResult: `
        1000000 * 2 = 2000000
        -1000000 * 2 = -2000000
      `,
    },
    {
      it: 'should use exponential notation when exponential notation is on',
      code: `
        1000000 * 2
        -1000000 * 2
      `,
      options: { exponentialNotation: true },
      expectedResult: `
        1000000 * 2 = 2·106
        -1000000 * 2 = -2·106
      `,
    },
    {
      it: 'should use exponential notation for numbers smaller than 1',
      code: `
        0.000002
        -0.000002
      `,
      options: { exponentialNotation: true },
      expectedResult: `
        0.000002 = 2·10-6
        -0.000002 = -2·10-6
      `,
    },
    {
      it: 'should not use exponential notation for positive numbers smaller than 10000',
      code: `
        4500 * 2
      `,
      options: { exponentialNotation: true },
      expectedResult: `
        4500 * 2 = 9000
      `,
    },
    {
      it: 'should not use exponential notation for negative numbers larger or equal 0.0001',
      code: `
        0.0001
      `,
      options: { exponentialNotation: true },
      expectedResult: `
        0.0001
      `,
    },
    {
      it: 'should not use exponential notation for Infinity',
      code: `
        1.5e400
        -1.5e400
      `,
      options: { exponentialNotation: true },
      expectedResult: `
        1.5e400 = Infinity
        -1.5e400 = -Infinity
      `,
    },
    {
      it: 'should always use exponential notation for large numbers',
      code: `
        1.1e46
        1.1e46 + 0.1e46
      `,
      expectedResult: `
        1.1e46 = 1.1·1046
        1.1e46 + 0.1e46 = 1.2·1046
      `,
    },
    {
      it: 'should not display any result for a line with "0" symbol',
      code: `
        0
      `,
      options: { exponentialNotation: true },
      expectedResult: `
        0
      `,
    },
    {
      it: 'should support negative powers for exponential notation',
      code: `
        2e-1
      `,
      expectedResult: `
        2e-1 = 0.2
      `,
    },
    {
      it: 'should be possible to see the result in degrees and radians',
      code: `
        3 = [rad]
        PI / 180 = [deg]
      `,
      expectedResult: `
        3 = [rad] = 3rad
        PI / 180 = [deg] = 1deg
      `,
    },
    {
      it: 'should display an error when units conversion cannot be performed',
      code: `
        2m = [kg]
        3 = [kg]
        4kg = [m/m]
      `,
      expectedResult: `
        2m = [kg]  Error: [m] cannot be converted to [kg]
        3 = [kg]  Error: unitless value cannot be converted to [kg]
        4kg = [m/m]  Error: [kg] cannot be converted to a unitless value
      `,
    },
    {
      it: 'should display an error when trying to add value with unit with unitless value',
      code: `
        1m + 2s
        3 + 4kg
        5kg + 6
      `,
      expectedResult: `
        1m + 2s  Error: Trying to add/subtract values with incompatible units: [m] and [s]
        3 + 4kg  Error: Trying to add/subtract unitless value and a value with [kg] unit
        5kg + 6  Error: Trying to add/subtract unitless value and a value with [kg] unit
      `,
    },
    {
      it: 'should not allow division by zero',
      code: `
        5 / 0
        5m / 0
        5m / 0m
        5 / 0m
        0 / 0
      `,
      expectedResult: `
        5 / 0  Error: Division by zero is not allowed
        5m / 0  Error: Division by zero is not allowed
        5m / 0m  Error: Division by zero is not allowed
        5 / 0m  Error: Division by zero is not allowed
        0 / 0  Error: Division by zero is not allowed
      `,
    },
    {
      it: 'should not allow rising zero to negative power',
      code: `
        0^(-1)
        (2 - 1 - 1)^(-2)
        0^0
      `,
      expectedResult: `
        0^(-1)  Error: Division by zero is not allowed
        (2 - 1 - 1)^(-2)  Error: Division by zero is not allowed
        0^0 = 1
      `,
    },
    {
      it: 'should not allow rising negative numbers to fractional powers',
      code: `
        (-4)^(-1.5)
        (-4)^0.5
        4^0.5
      `,
      expectedResult: `
        (-4)^(-1.5)  Error: Raising negative numbers to fractional powers is not supported
        (-4)^0.5  Error: Raising negative numbers to fractional powers is not supported
        4^0.5 = 2
      `,
    },
    {
      it: 'should limit precision to enable nicer looking results',
      code: `
        1.00000000000001e46
        1.000000000000001e46
        0.1 + 0.2
        0.3 - 0.1
        5 - 9.4333
        sin(30deg)
        cos(60deg)
        1 / 3
        20
        202
        2020
        2.02
        2.020
      `,
      expectedResult: `
        1.00000000000001e46 = 1.00000000000001·1046
        1.000000000000001e46 = 1·1046
        0.1 + 0.2 = 0.3
        0.3 - 0.1 = 0.2
        5 - 9.4333 = -4.4333
        sin(30deg) = 0.5
        cos(60deg) = 0.5
        1 / 3 = 0.333333333333333
        20
        202
        2020
        2.02
        2.020 = 2.02
      `,
    },
    {
      it: 'should support functions',
      code: `
        f(x) = x * 3
        a = 2

        c = f(a)
      `,
      expectedResult: `
        f(x) = x * 3
        a = 2

        c = f(a) = 6
      `,
    },
    {
      it: 'should show function result in default unit',
      code: `
        f(x) = x * 3
        a = 2kg

        c = f(a)
      `,
      expectedResult: `
        f(x) = x * 3
        a = 2kg

        c = f(a) = 6kg
      `,
    },
    {
      it: 'should display an error for function with invalid parameters',
      code: `
        f(;) = x * 3
        a = 2kg

        c = f(a)
      `,
      expectedResult: `
        f(;) = x * 3  Error: Invalid function parameters
        a = 2kg

        c = f(a)  Error: Missing or invalid function f
      `,
    },
    {
      it: 'should display an error when redefining built-in function as a variable',
      code: `
        sqrt = 2
      `,
      expectedResult: `
        sqrt = 2  Error: Variable or function cannot have the same name as an existing function "sqrt"
      `,
    },
    {
      it: 'should display an error when redefining custom function as a variable',
      code: `
        f(x) = x * 2
        f = 4
      `,
      expectedResult: `
        f(x) = x * 2
        f = 4  Error: "f" has already been defined. Variables and functions cannot be redefined
      `,
    },
    {
      it: 'should display an error when redefining custom function as another custom function',
      code: `
        f(x) = x * 2
        f(y) = x / 2
      `,
      expectedResult: `
        f(x) = x * 2
        f(y) = x / 2  Error: "f" has already been defined. Variables and functions cannot be redefined
      `,
    },
    {
      it: 'should display an error when redefining variable as a custom function',
      code: `
        f = 4
        f(x) = x * 2
      `,
      expectedResult: `
        f = 4
        f(x) = x * 2  Error: "f" has already been defined. Variables and functions cannot be redefined
      `,
    },
    {
      it: 'should display an error when redefining built-in function as a custom function',
      code: `
        sqrt(x) = x * 2
      `,
      expectedResult: `
        sqrt(x) = x * 2  Error: Variable or function cannot have the same name as an existing function "sqrt"
      `,
    },
    {
      it: 'should support multi-argument functions',
      code: `
        f(x, y) = x * y
        a = 2
        b = 3

        c = f(a, b)
      `,
      expectedResult: `
        f(x, y) = x * y
        a = 2
        b = 3

        c = f(a, b) = 6
      `,
    },
    {
      it: 'should support zero-argument functions',
      code: `
        f() = 3 * 2

        a = f()
      `,
      expectedResult: `
        f() = 3 * 2

        a = f() = 6
      `,
    },
    {
      it: 'should show multi-argument function result in default unit',
      code: `
        f(x, y) = x + y
        a = 2kg
        b = 500g

        c = f(a, b)
      `,
      expectedResult: `
        f(x, y) = x + y
        a = 2kg
        b = 500g = 0.5kg

        c = f(a, b) = 2.5kg
      `,
    },
    {
      it: 'should display an error for multi-argument function with invalid parameters',
      code: `
        f(x, ;) = x * 3
        a = 2kg

        c = f(a)
      `,
      expectedResult: `
        f(x, ;) = x * 3  Error: Invalid function parameters
        a = 2kg

        c = f(a)  Error: Missing or invalid function f
      `,
    },
    {
      it: 'should display an error for two adjacent brackets',
      code: `
        f(x, y) = x * y

        f(2)(3)
      `,
      expectedResult: `
        f(x, y) = x * y

        f(2)(3)  Error: Expected an operator or comma but encountered another parenthesis
      `,
    },
  ].forEach((testCaseData) => {
    it(testCaseData.it, () => {
      // when
      const result = tokenizedCodeToString(tokenizeCode(testCaseData.code, testCaseData.options));

      // then
      expect(trimIndentation(result)).toEqual(trimIndentation(testCaseData.expectedResult));
    });
  });
});
