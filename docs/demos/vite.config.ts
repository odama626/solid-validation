import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

const src = (path: string) => fileURLToPath(new URL(path, import.meta.url));

// Built separately from the docs shell so the v1 library keeps its own Solid 1.
// Output lands in the shell's public/ folder and ships as part of its dist.
export default defineConfig({
  base: '/demos/',
  plugins: [solid()],
  resolve: {
    alias: {
      '@sparkstone/solid-validation/pocketbase': src('../../src/pocketbase.ts'),
      '@sparkstone/solid-validation': src('../../src/main.ts'),
    },
    dedupe: ['solid-js', 'solid-js/web', 'solid-js/store'],
  },
  build: { outDir: '../public/demos', emptyOutDir: true, target: 'esnext' },
});
