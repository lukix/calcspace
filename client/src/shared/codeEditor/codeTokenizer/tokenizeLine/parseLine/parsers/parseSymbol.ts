const ALL_WHITESPACES_REGEX = /\s/g;
const sanitize = (str: string) => str.replace(ALL_WHITESPACES_REGEX, '');

const IS_SYMBOL_REGEX = /^[A-Za-z]\w*$/;
const IS_FUNCTION_REGEX = /^([A-Za-z]\w*)\((.*)\)$/;

export class ParseSymbolError {
  message: string;
  start: number;
  end: number;

  constructor(message, start, end) {
    this.message = message;
    this.start = start;
    this.end = end;
  }
}

type ParseSymbolType = (
  symbolString: string
) => { type: 'VARIABLE'; name: string } | { type: 'FUNCTION'; name: string; arguments: string[] };

const parseSymbol: ParseSymbolType = (symbolString) => {
  const symbol = sanitize(symbolString);

  const functionMatch = IS_FUNCTION_REGEX.exec(symbol);

  if (functionMatch) {
    const functionArguments = functionMatch[2] ? functionMatch[2].split(',') : []; // sanitize?, check arguments uniqueness?
    if (
      functionArguments.some((argument) => {
        return !argument.match(IS_SYMBOL_REGEX);
      })
    ) {
      throw new ParseSymbolError(
        'Invalid function parameters',
        symbolString.indexOf('(') + 1,
        symbolString.indexOf(')')
      );
    }

    return { type: 'FUNCTION', name: functionMatch[1], arguments: functionArguments };
  }

  if (!symbol.match(IS_SYMBOL_REGEX)) {
    throw new ParseSymbolError('Invalid value on the left side of the equal sign', null, null);
  }

  return { type: 'VARIABLE', name: symbol };
};

export default parseSymbol;
