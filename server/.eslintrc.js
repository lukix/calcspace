module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:jest/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  plugins: ['jest', '@typescript-eslint'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      modules: true,
    },
  },
  env: {
    es6: true,
    node: true,
    'jest/globals': true,
  },
  rules: {
    // 'max-len': ['error', { code: 100, ignoreComments: true, ignoreTemplateLiterals: true }],
    // 'func-names': ['off'],
    // 'arrow-parens': ['off'],
    // 'import/prefer-default-export': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    // '@typescript-eslint/ban-ts-ignore': 0,
    // '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
  },
  root: true,
};
