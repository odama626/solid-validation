# Adding a documentation version

Each major version of the library gets its own site under `docs/versions/<id>`,
with its own framework and its own Solid. They share nothing at runtime; the
header switcher navigates between them as separate pages.

## What a version builds against

A version site documents one library release, so it depends on that release:

- The line still under development uses `"@sparkstone/solid-validation": "workspace:^"`,
  which resolves to the package in this repo.
- Every frozen line pins its major from npm, for example `"^1"`.

This matters the day `src/` becomes 2.x. At that point the v1 site must stop
following the workspace package, or it will build its demos against a library
its documentation does not describe. The switch is one line in
`docs/versions/v1/package.json`:

```diff
-"@sparkstone/solid-validation": "workspace:^"
+"@sparkstone/solid-validation": "^1"
```

Do that in the same commit that bumps the library to 2.0.0, and set
`"source": "npm"` on the v1 entry in `versions.json` so the intent is recorded.

## Building

`pnpm build` builds only the highest version plus the root index. Older versions
are frozen: their content is fixed and the library they document is published,
so rebuilding them replaces a known-good build with whatever the current
toolchain happens to produce.

```sh
pnpm build             # newest version + root
pnpm build:version v1  # one named version, when you do mean to
pnpm build:all         # every version
```

`pnpm dev` runs the newest version for the same reason.

A version whose `source` is `workspace` triggers a library build first, since
its demos resolve the package entry. A version pinned to npm does not.

## Adding a version

1. Copy the previous version's directory to `docs/versions/<id>`.
2. Pin the previous version to its npm major, as above.
3. Add an entry to `versions.json` and set `current` if it is now the default.
4. Nothing to add to `docs/package.json`: the scripts read `versions.json`.

`versions.json` drives the switcher in both sites and the landing page at `/`,
so nothing else needs editing.
