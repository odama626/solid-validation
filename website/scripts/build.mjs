import { execFileSync } from 'node:child_process';
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

const targets = all ? byNewest : named.length ? byNewest.filter(v => named.includes(v.id)) : [byNewest[0]];

if (!targets.length) {
  throw new Error(`no such version: ${named.join(', ')}. Known: ${byNewest.map(v => v.id).join(', ')}`);
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
