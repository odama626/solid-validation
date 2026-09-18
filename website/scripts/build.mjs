import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import versions from '../versions.json' with { type: 'json' };

/**
 * Older versions are frozen: their content is fixed and the library they
 * document is published. Rebuilding them is at best a no-op and at worst
 * replaces a known-good build with whatever the current toolchain produces.
 *
 * So the default build covers only the highest version plus the root index.
 * Rebuilding an older one is possible, but you have to name it.
 */
const here = fileURLToPath(new URL('.', import.meta.url));
const run = (cmd, args) => execFileSync(cmd, args, { cwd: here + '..', stdio: 'inherit' });

const order = id => Number(/\d+/.exec(id)?.[0] ?? 0);
const byNewest = [...versions.versions].sort((a, b) => order(b.id) - order(a.id));

const args = process.argv.slice(2);
const all = args.includes('--all');
const named = args.filter(a => !a.startsWith('--'));

// A version can be listed in versions.json before its site exists, so that the
// switchers start offering it. Skip those rather than failing the build.
const built = byNewest.filter(v =>
  existsSync(fileURLToPath(new URL(`../versions/${v.id}`, import.meta.url))),
);

for (const version of byNewest) {
  if (!built.includes(version)) {
    console.warn(`skipping ${version.id}: listed in versions.json but versions/${version.id} does not exist`);
  }
}

const targets = all
  ? built
  : named.length
    ? built.filter(v => named.includes(v.id))
    : built.slice(0, 1);

if (!targets.length && named.length) {
  throw new Error(`no buildable version named: ${named.join(', ')}. Built: ${built.map(v => v.id).join(', ')}`);
}

// A version tracking the workspace package needs the library built first; one
// pinned to npm does not.
if (targets.some(v => v.source === 'workspace')) {
  run('pnpm', ['--filter', '@sparkstone/solid-validation', 'build']);
}

for (const version of targets) {
  console.log(`\n=== ${version.id} (${version.label}) ===`);
  run('pnpm', ['--filter', `solid-validation-docs-${version.id}`, 'build']);
  run('node', ['./scripts/collect.mjs', version.id]);
}

run('node', ['./root/build.mjs']);
