import tokenizeCode from '../tokenizeCode';
import { tokens } from '../constants';

describe('tokenizeCode - tokenization test', () => {
  it('should return tokenized structure with results', () => {
    // given
    const code = 'x = 2 + 3\ny = x + 2';

    // when
    const tokenizedCode = tokenizeCode(code);

    // then
    expect(tokenizedCode).toEqual([
      [
        { value: 'x = 2 + 3', tags: [tokens.NORMAL] },
        { value: ' = 5', tags: [tokens.VIRTUAL] },
      ],
      [
        { value: 'y = x + 2', tags: [tokens.NORMAL] },
        { value: ' = 7', tags: [tokens.VIRTUAL] },
      ],
    ]);
  });

  it('should not append result when it is the same as assignment right-hand side', () => {
    // given
    const code = 'x = 5';

    // when
    const tokenizedCode = tokenizeCode(code);

    // then
    expect(tokenizedCode).toEqual([[{ value: 'x = 5', tags: [tokens.NORMAL] }]]);
  });

  it('should tag expression with error if there are not evaluated symbols', () => {
    // given
    const code = 'a = x\na + 1';

    // when
    const tokenizedCode = tokenizeCode(code);

    // then
    expect(tokenizedCode).toEqual([
      [
        { value: 'a = ', tags: [tokens.NORMAL, tokens.ERROR] },
        {
          value: 'x',
          tags: [tokens.NORMAL, tokens.ERROR, tokens.ERROR_SOURCE],
        },
        {
          value: '  Error: Missing value for symbol x',
          tags: [tokens.VIRTUAL],
        },
      ],
      [
        { value: 'a', tags: [tokens.NORMAL, tokens.ERROR, tokens.ERROR_SOURCE] },
        { value: ' + 1', tags: [tokens.NORMAL, tokens.ERROR] },
        {
          value: '  Error: Missing value for symbol a',
          tags: [tokens.VIRTUAL],
        },
      ],
    ]);
  });

  it('should treat lines with leading "//" as comments', () => {
    // given
    const code = '// this is a comment';

    // when
    const tokenizedCode = tokenizeCode(code);

    // then
    expect(tokenizedCode).toEqual([[{ value: '// this is a comment', tags: [tokens.COMMENT] }]]);
  });

  it('should allow spaces before comment slashes', () => {
    // given
    const code = '  // this is a comment with leading spaces';

    // when
    const tokenizedCode = tokenizeCode(code);

    // then
    expect(tokenizedCode).toEqual([
      [
        {
          value: '  // this is a comment with leading spaces',
          tags: [tokens.COMMENT],
        },
      ],
    ]);
  });

  it('should not allow characters preceding "//"', () => {
    // given
    const code = '5 + 5 // comment must start at the beginning of the line';

    // when
    const tokenizedCode = tokenizeCode(code);

    // then
    expect(tokenizedCode[0][0].tags).toContain(tokens.ERROR);
  });
});
