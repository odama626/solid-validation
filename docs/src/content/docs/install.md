---
title: Install
description: Installing @sparkstone/solid-validation and configuring TypeScript for its directives.
---

```sh
npm install @sparkstone/solid-validation
```

```sh
pnpm add @sparkstone/solid-validation
```

Solid 1.9 or newer is a peer dependency. Nothing else is bundled.

## Directives need the JSX transform

`use:validate` and `use:formSubmit` are Solid directives, so they are compiled away by `babel-preset-solid`. They work in any project built with `vite-plugin-solid`, SolidStart, or an Astro site using `@astrojs/solid-js`. They do not work in a project that only runs the TypeScript JSX transform.

Two consequences worth knowing before you hit them:

- The directive name has to be in scope as a variable. `const { validate } = useForm()` is what makes `use:validate` compile. Destructuring is not a style choice here.
- A bundler that drops unused variables will remove `validate` if you only reference it through the directive. Solid's Babel plugin handles this, but a separate minifier running before it will not.

## TypeScript

The package declares both directives on Solid's `JSX.Directives` interface, so no extra setup is needed as long as your `tsconfig.json` points JSX at Solid:

```json
{
  "compilerOptions": {
    "jsx": "preserve",
    "jsxImportSource": "solid-js"
  }
}
```

If your editor reports that `use:validate` does not exist, the file importing `useForm` is not being seen by the same TypeScript project.

## PocketBase helpers

The PocketBase adapter ships as a separate entry point and is not pulled into your bundle unless you import it:

```ts
import { parsePocketbaseError } from '@sparkstone/solid-validation/pocketbase';
```
