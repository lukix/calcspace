module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:jest/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
  ],
  plugins: ['jest', '@typescript-eslint'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      modules: true,
      jsx: true,
    },
  },
  env: {
    es6: true,
    node: false,
    'jest/globals': true,
  },
  rules: {
    'react/prop-types': 0,
  },
  root: true,
};
