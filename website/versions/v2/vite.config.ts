import solid from '@solidjs/vite-plugin';
import { serverFunctions } from '@solidjs/prerender/integration';
import { fileRoutes } from 'filesystem-routing/vite';
import { prerender } from 'prerender-crawler/vite';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const src = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  // Pages serves the site under the repo name, so assets need that prefix. The
  // /v2 segment on top of it comes from the route tree.
  base: '/solid-validation/',
  plugins: [
    solid({ start: true, ssr: true, serverFunctions: true, extensions: ['.jsx', '.tsx'] }),
    fileRoutes(),
    // Crawls the built app and writes every page out as static HTML.
    prerender({ mode: 'static', integrations: [serverFunctions()] }),
  ],
  resolve: {
  },
  server: { port: 3000 },
  build: { target: 'esnext' },
});
