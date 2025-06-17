import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts() // <-- Add the dts plugin
  ],
  build: {
    lib: {
      entry: {
        'browser': resolve(__dirname, 'src/browser.ts'),
        'models/auth/index': resolve(__dirname, 'src/models/auth/index.ts'),
        'models/users/index': resolve(__dirname, 'src/models/users/index.ts')
      },
      formats: ['es']
    },
    rollupOptions: {
      external: ['valibot', 'msw/browser', 'msw']
    }
  }
});