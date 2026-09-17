import { cp, mkdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Each version builds independently; this drops its output at dist/<id>/ so the
// whole docs tree can be served from one directory.
const id = process.argv[2];
if (!id) throw new Error('usage: collect.mjs <version-id>');

const candidates = [`../${id}/dist/client`, `../${id}/dist`];
const from = candidates
  .map(p => fileURLToPath(new URL(p, import.meta.url)))
  .find(p => existsSync(p));

if (!from) throw new Error(`no build output found for ${id}`);

const to = fileURLToPath(new URL(`../dist/${id}`, import.meta.url));
await rm(to, { recursive: true, force: true });
await mkdir(to, { recursive: true });
await cp(from, to, { recursive: true });
console.log(`${id}: ${from} -> dist/${id}`);
