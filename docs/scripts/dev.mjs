import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import versions from '../versions.json' with { type: 'json' };

// Same default as the build: the newest version is the one being worked on.
const order = id => Number(/\d+/.exec(id)?.[0] ?? 0);
const newest = [...versions.versions].sort((a, b) => order(b.id) - order(a.id))[0];

execFileSync('pnpm', ['--filter', `solid-validation-docs-${newest.id}`, 'dev'], {
  cwd: fileURLToPath(new URL('..', import.meta.url)),
  stdio: 'inherit',
});
