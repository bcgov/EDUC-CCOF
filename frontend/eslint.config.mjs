import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import globals from 'globals';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';
import pluginVue from 'eslint-plugin-vue';
import pluginCypress from 'eslint-plugin-cypress';

export default defineConfig([
  {
    ignores: ['dist/', 'tests/'],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    plugins: { js },
    files: ['src/**/*.{vue,js}', 'tests/cypress/**/*/js'],
    extends: ['js/recommended', ...pluginVue.configs['flat/recommended'], eslintPluginPrettier],
    rules: {
      semi: 'off',
      'eol-last': ['error', 'always'],
      indent: ['off'], // Let prettier decide
      quotes: ['error', 'single', { avoidEscape: true }],
      'no-unused-vars': [
        'error',
        { args: 'after-used', argsIgnorePattern: '^_', caughtErrors: 'all', caughtErrorsIgnorePattern: '^ignore' },
      ],
      'vue/no-v-text-v-html-on-component': ['error', { allow: ['v-card-text'] }],
      'vue/valid-v-slot': [
        'error',
        {
          allowModifiers: true,
        },
      ],
    },
  },
  {
    files: ['tests/cypress/**/*.js'],
    extends: [pluginCypress.configs.recommended],
  },
]);
