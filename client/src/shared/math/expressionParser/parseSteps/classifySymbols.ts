import tokens from '../tokens';
import symbolTypes from '../symbolTypes';
import { ParserError } from '../errors';

const VARIABLE_SYMBOL_REGEX = /^[A-Za-z]\w*$/;
const NUMERIC_SYMBOL_REGEX = /^(((0)|(0\.[0-9]+)|([1-9]+[0-9]*\.?[0-9]*))(e-?[0-9]+)?)$/;
const NUMERIC_SYMBOL_WITH_UNIT_REGEX = /^(?<number>((0)|(0\.[0-9]+)|([1-9]+[0-9]*\.?[0-9]*))(e-?[0-9]+)?)(?<unit>[A-Za-z%]+)$/;

const classifySymbols = (tokensList) => {
  return tokensList.map((token) => {
    if (token.type !== tokens.SYMBOL) {
      return token;
    }
    if (token.value === 'Infinity') {
      throw new ParserError(`Variable cannot be named "Infinity"`, {
        start: token.position,
        end: token.position + token.value.length,
      });
    }
    if (token.value.match(VARIABLE_SYMBOL_REGEX)) {
      return { ...token, symbolType: symbolTypes.VARIABLE };
    }
    if (token.value.match(NUMERIC_SYMBOL_REGEX)) {
      return {
        ...token,
        symbolType: symbolTypes.NUMERIC,
        number: Number(token.value),
      };
    }
    const numericWithUnitMatch = token.value.match(NUMERIC_SYMBOL_WITH_UNIT_REGEX);
    if (numericWithUnitMatch) {
      const {
        groups: { number, unit },
      } = numericWithUnitMatch;
      return {
        ...token,
        symbolType: symbolTypes.NUMERIC_WITH_UNIT,
        number: Number(number),
        unit,
      };
    }
    throw new ParserError(`Invalid symbol "${token.value}"`, {
      start: token.position,
      end: token.position + token.value.length,
    });
  });
};

export default classifySymbols;
