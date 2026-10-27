import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';

export default defineConfig({
  plugins: [glsl({ compress: true })],
  build: {
    target: 'es2022',
    assetsInlineLimit: 0,
    // three's WebGLRenderer alone is most of the bundle; ~200 kB gzip is expected here.
    chunkSizeWarningLimit: 800,
  },
});
