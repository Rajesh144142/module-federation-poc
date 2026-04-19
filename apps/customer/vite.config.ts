import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'customer',
      filename: 'remoteEntry.js',
      exposes: {
        './CustomerPanel': './src/features/customer/components/CustomerPanel.tsx',
      },
      shared: ['react', 'react-dom'],
    }),
  ],
  server: {
    port: 3001,
    strictPort: true,
    cors: true,
  },
  preview: {
    port: 3001,
  },
  build: {
    target: 'esnext',
  },
});
