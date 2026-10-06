import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': decodeURIComponent(new URL('./src', import.meta.url).pathname),
      '@components': decodeURIComponent(
        new URL('./src/components', import.meta.url).pathname,
      ),
      '@features': decodeURIComponent(
        new URL('./src/features', import.meta.url).pathname,
      ),
      '@app': decodeURIComponent(
        new URL('./src/app/', import.meta.url).pathname,
      ),
    },
  },
});
