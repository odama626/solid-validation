import { cp, mkdir, rm } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import versions from '../versions.json' with { type: 'json' };

/**
 * Each version site already carries its own /<id> prefix internally, but the
 * two frameworks express that differently:
 *
 *   astro  base: '/v1'  -> dist/v1/** , assets under dist/v1/_astro
 *   solid  route segment -> dist/client/v2/**, assets at dist/client/assets
 *
 * The astro output is self-contained and nests under dist/<id>. The solid
 * output references /assets absolutely, so it merges into the dist root and
 * relies on its own route segment for namespacing. Other versions' ids are
 * skipped, since a crawler will have followed the switcher into them.
 */
const id = process.argv[2];
if (!id) throw new Error('usage: collect.mjs <version-id>');

const here = fileURLToPath(new URL('.', import.meta.url));
const dist = fileURLToPath(new URL('../../docs', import.meta.url));
const others = versions.versions.map(v => v.id).filter(v => v !== id);

// The solid site emits dist/client; astro emits dist. That is the discriminator.
const merged = fileURLToPath(new URL(`../versions/${id}/dist/client`, import.meta.url));
const nested = fileURLToPath(new URL(`../versions/${id}/dist`, import.meta.url));

await mkdir(dist, { recursive: true });

if (existsSync(merged)) {
  // Hashed filenames change on every content edit, so a plain copy would leave
  // the previous build's assets behind. Clear what this version owns first.
  await rm(`${dist}/${id}`, { recursive: true, force: true });
  await rm(`${dist}/assets`, { recursive: true, force: true });

  // The crawler follows base-prefixed links, so the pages it wrote sit under
  // that prefix. Assets stay at the output root.
  const base = new URL(readFileSync(new URL('../versions/' + id + '/vite.config.ts', import.meta.url), 'utf8')
    .match(/base: '([^']*)'/)?.[1] ?? '/', 'file:///').pathname;
  const prefixed = `${merged}${base}${id}`;
  const pages = existsSync(prefixed) ? prefixed : `${merged}/${id}`;

  await cp(pages, `${dist}/${id}`, { recursive: true });
  await cp(`${merged}/assets`, `${dist}/assets`, { recursive: true });
  console.log(`${id}: merged -> docs/${id} with assets at docs/assets`);
} else if (existsSync(nested)) {
  const to = `${dist}/${id}`;
  await rm(to, { recursive: true, force: true });
  await cp(nested, to, { recursive: true });
  console.log(`${id}: nested -> dist/${id}`);
} else {
  throw new Error(`no build output found for ${id}`);
}
