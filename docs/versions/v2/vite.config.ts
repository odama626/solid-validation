import solid from '@solidjs/vite-plugin';
import { serverFunctions } from '@solidjs/prerender/integration';
import { fileRoutes } from 'filesystem-routing/vite';
import { prerender } from 'prerender-crawler/vite';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const src = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  // No base: prerender-crawler resolves crawled links against the output root,
  // and a Vite base makes it emit a duplicate nested tree. The /v1 and /v2
  // prefixes are route segments and deploy-time folders, not a Vite base.
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
