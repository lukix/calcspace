import tokens from './tokens';
import { ParserError } from './errors';

const validateNonNumericSymbol = (value) => {
  if (!Number.isNaN(Number(value)) && !Number.isFinite(Number(value))) {
    throw new ParserError('Invalid symbol');
  }

  const firstChar = value[0];
  const lastChar = value[value.length - 1];
  if (firstChar === '_' || lastChar === '_') {
    throw new ParserError(
      'Symbol cannot have leading or trailing underscore characters'
    );
  }

  if ('0123456789'.split('').includes(firstChar)) {
    throw new ParserError('Non-numeric symbol cannot start with a digit');
  }

  if (value.split('').includes('.')) {
    throw new ParserError('Non-numeric symbol cannot have commas');
  }
};

const validateSymbols = (tokensList) => {
  tokensList.forEach((token) => {
    if (token.type === tokens.SUBEXPRESSION) {
      validateSymbols(token.value);
    }
    if (token.type === tokens.FUNCTION) {
      validateNonNumericSymbol(token.name);
      validateSymbols(token.subexpressionContent);
    }
    if (token.type === tokens.SYMBOL) {
      const number = Number(token.value);
      if (!Number.isNaN(number)) {
        if (!Number.isFinite(number)) {
          throw new ParserError('Invalid symbol');
        }
        return;
      }

      validateNonNumericSymbol(token.value);
    }
  });
  return tokensList;
};

export default validateSymbols;
