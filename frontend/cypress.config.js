import { defineConfig } from 'cypress';

import viteConfig from './vite.config.js';

export default defineConfig({
  component: {
    specPattern: 'tests/cypress/component/**/*.{js,jsx,ts,tsx,vue}',
    supportFile: 'tests/cypress/support/component.js',
    fixturesFolder: 'tests/cypress/fixtures',
    indexHtmlFile: 'tests/cypress/support/component-index.html',
    devServer: {
      framework: 'vue',
      bundler: 'vite',
      viteConfig: viteConfig,
    },
  },
});
