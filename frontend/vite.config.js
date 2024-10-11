import { URL, fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 8082,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  build: {
    assetsInlineLimit: 0,
  },
  publicDir: 'public',
});
