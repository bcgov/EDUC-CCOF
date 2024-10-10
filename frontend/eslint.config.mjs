import js from '@eslint/js';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';
import pluginVue from 'eslint-plugin-vue';

export default [
  ...pluginVue.configs['flat/recommended'],
  js.configs.recommended,
  eslintPluginPrettier,
  {
    ignores: ['dist/', 'tests/'],
  },
  {
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
];
