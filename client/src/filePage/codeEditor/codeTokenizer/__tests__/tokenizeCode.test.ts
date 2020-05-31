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

  it('should correctly mark incorrect part when there are no equal characters', () => {
    // given
    const code = '2 + 3b + 4';

    // when
    const tokenizedCode = tokenizeCode(code);

    // then
    expect(tokenizedCode).toEqual([
      [
        { value: '2 + ', tags: [tokens.NORMAL, tokens.ERROR] },
        {
          value: '3b',
          tags: [tokens.NORMAL, tokens.ERROR, tokens.ERROR_SOURCE],
        },
        { value: ' + 4', tags: [tokens.NORMAL, tokens.ERROR] },
        {
          value: '  Error: Unknown unit "b"',
          tags: [tokens.VIRTUAL],
        },
      ],
    ]);
  });

  it('should correctly mark incorrect expression part in assignment', () => {
    // given
    const code = 'x = 2 + 3b + 4';

    // when
    const tokenizedCode = tokenizeCode(code);

    // then
    expect(tokenizedCode).toEqual([
      [
        { value: 'x = 2 + ', tags: [tokens.NORMAL, tokens.ERROR] },
        {
          value: '3b',
          tags: [tokens.NORMAL, tokens.ERROR, tokens.ERROR_SOURCE],
        },
        { value: ' + 4', tags: [tokens.NORMAL, tokens.ERROR] },
        {
          value: '  Error: Unknown unit "b"',
          tags: [tokens.VIRTUAL],
        },
      ],
    ]);
  });

  it('should correctly mark incorrect symbol part in assignment', () => {
    // given
    const code = '8 + 9 = 2 + 3 + 4';

    // when
    const tokenizedCode = tokenizeCode(code);

    // then
    expect(tokenizedCode).toEqual([
      [
        {
          value: '8 + 9 ',
          tags: [tokens.NORMAL, tokens.ERROR, tokens.ERROR_SOURCE],
        },
        { value: '= 2 + 3 + 4', tags: [tokens.NORMAL, tokens.ERROR] },
        {
          value: '  Error: Invalid value on the left side of the equal sign',
          tags: [tokens.VIRTUAL],
        },
      ],
    ]);
  });

  it('should correctly mark incorrect symbol part in assignment with desired unit', () => {
    // given
    const code = '8 + 9 = 2 + 3 + 4 = [kg]';

    // when
    const tokenizedCode = tokenizeCode(code);

    // then
    expect(tokenizedCode).toEqual([
      [
        {
          value: '8 + 9 ',
          tags: [tokens.NORMAL, tokens.ERROR, tokens.ERROR_SOURCE],
        },
        { value: '= 2 + 3 + 4 = [kg]', tags: [tokens.NORMAL, tokens.ERROR] },
        {
          value: '  Error: Invalid value on the left side of the equal sign',
          tags: [tokens.VIRTUAL],
        },
      ],
    ]);
  });

  it('should correctly mark incorrect desired unit part in assignment', () => {
    // given
    const code = 'a = 2kg + 300g = [kg';

    // when
    const tokenizedCode = tokenizeCode(code);

    // then
    expect(tokenizedCode).toEqual([
      [
        { value: 'a = 2kg + 300g =', tags: [tokens.NORMAL, tokens.ERROR] },
        {
          value: ' [kg',
          tags: [tokens.NORMAL, tokens.ERROR, tokens.ERROR_SOURCE],
        },
        {
          value: '  Error: Expected square brackets [...] after last "="',
          tags: [tokens.VIRTUAL],
        },
      ],
    ]);
  });

  it('should correctly mark incorrect desired unit part in expression', () => {
    // given
    const code = '2kg + 300g = [kg';

    // when
    const tokenizedCode = tokenizeCode(code);

    // then
    expect(tokenizedCode).toEqual([
      [
        { value: '2kg + 300g =', tags: [tokens.NORMAL, tokens.ERROR] },
        {
          value: ' [kg',
          tags: [tokens.NORMAL, tokens.ERROR, tokens.ERROR_SOURCE],
        },
        {
          value: '  Error: Found opening square bracket "[" without a closing one "]"',
          tags: [tokens.VIRTUAL],
        },
      ],
    ]);
  });

  it('should correctly mark desired unit part', () => {
    // given
    const code = 'x = 2kg + 300g = [kg]';

    // when
    const tokenizedCode = tokenizeCode(code);

    // then
    expect(tokenizedCode).toEqual([
      [
        { value: 'x = 2kg + 300g =', tags: [tokens.NORMAL] },
        {
          value: ' [kg]',
          tags: [tokens.NORMAL, tokens.DESIRED_UNIT],
        },
        {
          value: ' = 2.3kg',
          tags: [tokens.VIRTUAL],
        },
      ],
    ]);
  });
});
