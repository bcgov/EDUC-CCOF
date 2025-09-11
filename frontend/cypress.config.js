import { defineConfig } from 'cypress';
import viteConfig from './vite.config.js';

export default defineConfig({
  component: {
    specPattern: 'tests/cypress/**/*.{js,jsx,ts,tsx,vue}',
    supportFile: 'tests/support/component.js',
    fixturesFolder: 'tests/fixtures',
    indexHtmlFile: 'tests/support/component-index.html',
    devServer: {
      framework: 'vue',
      bundler: 'vite',
      viteConfig: viteConfig,
    },
  },
});
