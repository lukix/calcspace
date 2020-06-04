import createTokenizedLineWithError from './createTokenizedLineWithError';

const IS_SYMBOL_REGEX = /^[A-Za-z]\w*$/;

const validateSymbol = ({ symbol, values, lineString, functions }) => {
  if (symbol !== null) {
    if (!symbol.match(IS_SYMBOL_REGEX)) {
      return createTokenizedLineWithError({
        values,
        lineString,
        errorMessage: 'Invalid value on the left side of the equal sign',
        end: lineString.indexOf('='),
      });
    }

    if (values[symbol] !== undefined) {
      return createTokenizedLineWithError({
        values,
        lineString,
        errorMessage: `Variable "${symbol}" already exists. Variables cannot be redefined`,
        end: lineString.indexOf('='),
      });
    }

    if (functions[symbol] !== undefined) {
      return createTokenizedLineWithError({
        values,
        lineString,
        errorMessage: `Variable cannot have the same name as an existing function "${symbol}"`,
        end: lineString.indexOf('='),
      });
    }
  }
};

export default validateSymbol;
