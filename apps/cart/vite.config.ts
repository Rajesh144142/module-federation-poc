import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'cart',
      filename: 'remoteEntry.js',
      exposes: {
        './MiniCart': './src/features/cart/components/MiniCart.tsx',
      },
      shared: ['react', 'react-dom'],
    }),
  ],
  server: {
    port: 3002,
    strictPort: true,
    cors: true,
  },
  preview: {
    port: 3002,
    strictPort: true,
  },
  build: {
    target: 'esnext',
  },
});
