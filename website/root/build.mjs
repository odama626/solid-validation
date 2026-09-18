import { copyFile, mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import versions from '../versions.json' with { type: 'json' };

const { current, versions: all } = versions;
const target = all.find(v => v.id === current) ?? all[0];
const out = fileURLToPath(new URL('../../docs/', import.meta.url));

// A soft redirect, not a 301: the list stays visible and crawlable, and a
// reader who lands here with JS off still gets somewhere useful.
const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>solid-validation documentation</title>
    <link rel="canonical" href="${target.path}" />
    <meta http-equiv="refresh" content="0; url=${target.path}" />
    <style>
      body { font: 1rem/1.6 system-ui, sans-serif; margin: 4rem auto; max-width: 32rem; padding: 0 1rem; }
      li { margin: 0.25rem 0; }
    </style>
  </head>
  <body>
    <h1>solid-validation</h1>
    <p>Taking you to the ${target.label} documentation.</p>
    <ul>
${all
  .map(
    v =>
      `      <li><a href="${v.path}">${v.label}</a>${v.id === current ? ' (current)' : ''}${
        v.prerelease ? ' (prerelease)' : ''
      }</li>`,
  )
  .join('\n')}
    </ul>
    <script>location.replace(${JSON.stringify(target.path)});</script>
  </body>
</html>
`;

await mkdir(out, { recursive: true });
await writeFile(new URL('index.html', `file://${out}`), html);

// GitHub Pages branch deploys run the output through Jekyll, which drops every
// path beginning with an underscore. Astro emits its assets into _astro/, so
// without this the v1 site publishes with no CSS or JS at all.
await writeFile(new URL('.nojekyll', `file://${out}`), '');

// Served alongside the sites so every build, however old, can fetch the
// current list of versions rather than the one it was compiled with.
await copyFile(
  fileURLToPath(new URL('../versions.json', import.meta.url)),
  fileURLToPath(new URL('versions.json', `file://${out}`)),
);
console.log(`root index -> ${target.path}`);
