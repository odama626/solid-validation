import { cp, mkdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
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
const dist = fileURLToPath(new URL('../dist', import.meta.url));
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
  await cp(merged, dist, {
    recursive: true,
    filter: src => {
      const rel = src.slice(merged.length + 1);
      if (!rel) return true;
      const top = rel.split('/')[0];
      // Its own crawl of the switcher links, and its placeholder root page.
      return !others.includes(top) && rel !== 'index.html';
    },
  });
  console.log(`${id}: merged -> dist/ (pages under /${id}, assets at /assets)`);
} else if (existsSync(nested)) {
  const to = `${dist}/${id}`;
  await rm(to, { recursive: true, force: true });
  await cp(nested, to, { recursive: true });
  console.log(`${id}: nested -> dist/${id}`);
} else {
  throw new Error(`no build output found for ${id}`);
}
