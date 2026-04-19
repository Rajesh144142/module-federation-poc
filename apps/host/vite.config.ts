import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'host',
      remotes: {
        customer: 'http://localhost:3001/assets/remoteEntry.js',
        cart: 'http://localhost:3002/assets/remoteEntry.js',
      },
      shared: ['react', 'react-dom'],
    }),
  ],
  server: {
    port: 3000,
    strictPort: true,
  },
  preview: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
});
