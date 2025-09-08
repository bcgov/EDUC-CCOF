import { defineConfig } from 'cypress';
import viteConfig from './vite.config.js';

export default defineConfig({
  component: {
    specPattern: 'tests/component/**/*.{js,jsx,ts,tsx,vue}',
    supportFile: 'tests/support/component.js',
    indexHtmlFile: 'tests/support/component-index.html',
    fixturesFolder: 'tests/fixtures',
    devServer: {
      framework: 'vue',
      bundler: 'vite',
      viteConfig,
    },
  },
});
