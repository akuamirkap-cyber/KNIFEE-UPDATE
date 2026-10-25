import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          game1: path.resolve(__dirname, 'games/game-1/index.html'),
          game2: path.resolve(__dirname, 'games/game-2/index.html'),
          game3: path.resolve(__dirname, 'games/game-3/index.html'),
          game4: path.resolve(__dirname, 'games/game-4/index.html'),
          game5: path.resolve(__dirname, 'games/game-5/index.html'),
          game6: path.resolve(__dirname, 'games/game-6/index.html'),
          game7: path.resolve(__dirname, 'games/game-7/index.html'),
          game8: path.resolve(__dirname, 'games/game-8/index.html'),
        },
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
