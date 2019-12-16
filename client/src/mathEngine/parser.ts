import { Parser } from 'expr-eval';

const parser = new Parser({
  operators: {
    add: true,
    divide: true,
    factorial: true,
    multiply: true,
    power: true,
    remainder: true,
    subtract: true,

    concatenate: false,
    conditional: false,
    logical: false,
    comparison: false,
    in: false,
    assignment: false,
  },
});

export default parser;
