import js from '@eslint/js';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';
import globals from 'globals';

export default [
  js.configs.recommended,
  eslintPluginPrettier,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    ignores: ['dist/', 'tests/'],
    rules: {
      semi: ['error', 'always'],
      'eol-last': ['error', 'always'],
      indent: ['off'], // Let prettier decide
      quotes: ['error', 'single', { avoidEscape: true }],
      'no-unused-vars': [
        'error',
        {
          args: 'after-used',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^ignore',
        },
      ],
    },
  },
];
