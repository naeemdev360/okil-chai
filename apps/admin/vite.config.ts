import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  server: {
    host: true,
    // Allow any *.lvh.me subdomain so the dev server accepts admin.lvh.me.
    allowedHosts: ['localhost', '127.0.0.1', '.lvh.me'],
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
});
