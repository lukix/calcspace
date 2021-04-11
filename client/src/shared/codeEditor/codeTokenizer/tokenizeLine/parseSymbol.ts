import createTokenizedLineWithError from './createTokenizedLineWithError';

const IS_SYMBOL_REGEX = /^[A-Za-z]\w*$/;
const IS_FUNCTION_REGEX = /^([A-Za-z]\w*)\((.*)\)$/;

const checkDuplicateSymbol = (symbol, lineString, values, functions, customFunctions) => {
  if (functions[symbol] !== undefined) {
    return {
      error: createTokenizedLineWithError({
        values,
        customFunctions,
        lineString,
        errorMessage: `Variable or function cannot have the same name as an existing function "${symbol}"`,
        end: lineString.indexOf('='),
      })
    };
  }

  if (values[symbol] !== undefined || customFunctions[symbol] !== undefined) {
    return {
      error: createTokenizedLineWithError({
        values,
        customFunctions,
        lineString,
        errorMessage: `"${symbol}" has already been defined. Variables and functions cannot be redefined`,
        end: lineString.indexOf('='),
      }),
    };
  }

  return {
    error: null,
  };
};

const parseSymbol = ({ symbol, values, customFunctions, lineString, functions }) => {
  if (symbol === null) {
    return {
      error: null,
    };
  }

  const functionMatch = IS_FUNCTION_REGEX.exec(symbol);
  if (functionMatch) {
    const functionArguments = functionMatch[2] ? functionMatch[2].split(',') : [];
    if (functionArguments.some(argument => {
      return !argument.match(IS_SYMBOL_REGEX);
    })) {
      return {
        functionName: null,
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

    const duplicateCheckResult = checkDuplicateSymbol(functionMatch[1], lineString, values,  functions, customFunctions);

    if (duplicateCheckResult.error) {
      return duplicateCheckResult;
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

  const duplicateCheckResult = checkDuplicateSymbol(symbol, lineString, values,  functions, customFunctions);

  if (duplicateCheckResult.error) {
    return duplicateCheckResult;
  }

  return {
    error: null,
  };
};

export default parseSymbol;
