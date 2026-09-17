---
title: Troubleshooting
description: The three things that actually go wrong, and how to tell which one you hit.
---

## use:validate does nothing

Directives are compiled away by `babel-preset-solid`, so they need Solid's JSX transform. They work in any project built with `vite-plugin-solid`, SolidStart, or Astro with `@astrojs/solid-js`. They do not work in a project running only the TypeScript JSX transform.

If the form renders but no field is ever checked, this is almost always why.

## TypeScript says use:validate does not exist

The directive types come from the package itself, so importing `useForm` is what registers them. If the error persists, your `tsconfig.json` is not pointing JSX at Solid:

```json
{
  "compilerOptions": {
    "jsx": "preserve",
    "jsxImportSource": "solid-js"
  }
}
```

## Errors land under the wrong key

The store key is the element's `name`, falling back to `data-name`. An `<input>` with neither is registered under an empty string rather than falling through to `data-name`, because `input.name` is `''` and not `undefined`. Give inputs a `name`, and give non-input elements a `data-name`.
