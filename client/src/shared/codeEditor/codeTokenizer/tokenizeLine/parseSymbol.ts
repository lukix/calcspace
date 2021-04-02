import createTokenizedLineWithError from './createTokenizedLineWithError';

const IS_SYMBOL_REGEX = /^[A-Za-z]\w*$/;
const IS_FUNCTION_REGEX = /^([A-Za-z]\w*)\((.*)\)$/;

const parseSymbol = ({ symbol, values, customFunctions, lineString, functions }) => {
  if (symbol !== null) {
    const functionMatch = IS_FUNCTION_REGEX.exec(symbol);
    if (functionMatch) {
      const functionArguments = functionMatch[2] ? functionMatch[2].split(',') : [];
      if (functionArguments.some(argument => {
        return !argument.match(IS_SYMBOL_REGEX);
      })) {
        return {
          error: createTokenizedLineWithError({
            values,
            customFunctions,
            lineString,
            errorMessage: 'Invalid function parameters',
            start: lineString.indexOf('(') + 1,
            end: lineString.indexOf(')'),
          }),
        };
      }
      return {
        functionName: functionMatch[1],
        functionArguments,
        error: null,
      };
    }

    if (!symbol.match(IS_SYMBOL_REGEX)) {
      return {
        error: createTokenizedLineWithError({
          values,
          customFunctions,
          lineString,
          errorMessage: 'Invalid value on the left side of the equal sign',
          end: lineString.indexOf('='),
        }),
      };
    }

    if (values[symbol] !== undefined) {
      return {
        error: createTokenizedLineWithError({
          values,
          customFunctions,
          lineString,
          errorMessage: `Variable "${symbol}" already exists. Variables cannot be redefined`,
          end: lineString.indexOf('='),
        }),
      };
    }

    if (functions[symbol] !== undefined) {
      return {
        error: createTokenizedLineWithError({
          values,
          customFunctions,
          lineString,
          errorMessage: `Variable cannot have the same name as an existing function "${symbol}"`,
          end: lineString.indexOf('='),
        })
      };
    }
  }

  return {
    error: null,
  };
};

export default parseSymbol;
