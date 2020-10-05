'use strict';

module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    webextensions: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb-base',
    'prettier',
    'prettier/@typescript-eslint',
  ],
  plugins: [
    '@typescript-eslint',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    'sourceType': 'module',
    'project': './tsconfig.json'
  },
  rules: {
    'prettier/prettier': ['warn'],

    // plugin import
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'import/prefer-default-export': 'off',

    // off
    'max-len': 'off',
    'no-unused-vars': 'off',
    'prefer-destructuring': 'off',
    'prefer-template': 'off',
    'class-methods-use-this': 'off',
    'lines-between-class-members': 'off',
  },
}
