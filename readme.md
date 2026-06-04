# @sparkstone/solid-validation

A lightweight and flexible validation library for Solid.js. It provides a simple API to validate form inputs, handle submission state, and manage error messages. It also supports validation outside of forms and inputs.

## Installation

```sh
npm install @sparkstone/solid-validation
```

or

```sh
pnpm add @sparkstone/solid-validation
```

## Table of Contents

- [Usage](#usage)

  - [Basic Example](#basic-example-form-based)
  - [Non-Form Validation](#validation-outside-of-forms-and-inputs)
  - [Passing Validation to Child Components](#passing-validation-to-child-components)

- [API](#api)

  - [`useForm(options?: { errorClass?: string })`](#useformoptions--errorclass-string-)

    - [`validate`](#validate)
    - [`formSubmit`](#formsubmit)
    - [`submit`](#submit)
    - [`errors`](#errors)
    - [`isSubmitting`](#issubmitting)
    - [`isSubmitted`](#issubmitted)
    - [`validateRef`](#validateref)
    - [`validateField`](#validatefield)
    - [`getFieldValue`](#getfieldvalue)

- [Custom Validation](#custom-validation)
- [PocketBase Integration](#pocketbase-integration)

## Usage

### Basic Example (Form Based)

```tsx
import { useForm } from '@sparkstone/solid-validation';

function min5Characters(el: HTMLInputElement) {
  if (el.value.length < 5) {
    return 'must be at least 5 characters long';
  }
}

function MyForm() {
  const { formSubmit, validate, errors, isSubmitting, isSubmitted } = useForm();

  async function onSubmit(form: HTMLFormElement) {
    const formData = new FormData(form);

    try {
      // Submit form data here
    } catch (e) {
      return {
        myCustomFormError: e.message,
      };
    }
  }

  return (
    <form use:formSubmit={onSubmit}>
      <input type='text' name='username' placeholder='Enter username' required use:validate />
      <span>{errors.username}</span>

      <input
        type='text'
        name='message'
        placeholder='Enter message'
        required
        use:validate={[min5Characters]}
      />
      <span>{errors.message}</span>

      <span>{errors.myCustomFormError}</span>

      <button type='submit' disabled={isSubmitting()}>
        {isSubmitting() ? 'Submitting...' : 'Submit'}
      </button>

      {isSubmitted() && <p>Form successfully submitted!</p>}
    </form>
  );
}
```

### Validation Outside of Forms and Inputs

You can validate any element, not just form inputs:

```tsx
<div use:validate={[myCustomValidator]} data-name='customField'></div>
```

- When using `use:validate` on non-input elements, you **must** supply a `data-name` attribute for error tracking.
- Validation can be triggered manually using the `submit()` function, even without a form.
- On validation failure, the library will automatically scroll the invalid element into view and focus it if possible.

```tsx
function MyComponent() {
  const { validate, submit, errors } = useForm();

  async function handleClick() {
    await submit(async () => {
      // perform your action here
      // return an object to set field-level errors, or return nothing on success
    });
  }

  return (
    <>
      <div use:validate={[myCustomValidator]} data-name='customField' />
      <span>{errors.customField}</span>
      <button onClick={handleClick}>Validate</button>
    </>
  );
}
```

### Passing Validation to Child Components

`use:validate` is a Solid.js directive and cannot be passed as a prop. Use `validateRef` instead — it returns a `ref`-compatible function that registers the element with the parent form's validation context.

Pass `validateRef` down as a prop and call it in the child with any validators:

```tsx
// ParentForm.tsx
function ParentForm() {
  const { formSubmit, validateRef, errors } = useForm();

  return (
    <form use:formSubmit={onSubmit}>
      <UsernameField validateRef={validateRef} />
      <span>{errors.username}</span>
      <button type='submit'>Submit</button>
    </form>
  );
}
```

```tsx
// UsernameField.tsx
import { useForm } from '@sparkstone/solid-validation';

interface UsernameFieldProps {
  validateRef: ReturnType<typeof useForm>['validateRef'];
}

function UsernameField(props: UsernameFieldProps) {
  return (
    <input
      type='text'
      name='username'
      required
      ref={props.validateRef(minLength)}
    />
  );
}
```

The child component owns its own validators — the parent just passes `validateRef` down without needing to know what rules each field applies.

## API

### `useForm(options?: { errorClass?: string })`

Accepts an optional `errorClass` string which, when provided, is toggled on invalid elements:

```tsx
const { formSubmit, validate } = useForm({ errorClass: 'input-error' });
```

#### Returns:

##### `validate`

`validate(ref: HTMLElement, validators?: Validator[])`

Registers an element for validation. Can be used as a directive on both form inputs and other HTML elements. Validation runs on `blur`; errors are cleared reactively on `input` once a field has been marked invalid.

```tsx
<input use:validate={[minLength, isEmail]} name='email' />
```

Falsy values are allowed in the validators array, enabling conditional validation:

```tsx
<input use:validate={[isRequired, requiresConfirmation && mustMatch]} name='password' />
```

##### `formSubmit`

`formSubmit(ref: HTMLFormElement, callback: OnFormSubmit)`

Handles form submission. Runs all registered validations, focuses and scrolls to the first failing field, and calls the callback only if all fields pass. Automatically adds `novalidate` to the form element and clears errors on form reset.

The callback receives the form element and can return an object to set server-side field errors:

```tsx
async function onSubmit(form: HTMLFormElement) {
  try {
    await api.submit(new FormData(form));
  } catch (e) {
    return { username: 'This username is already taken' };
  }
}
```

If the callback returns nothing (or `void`), all errors are cleared and `isSubmitted` is set to `true`. If it returns an object, those errors are merged into the `errors` store.

##### `submit`

`submit(callback: (payload?: Payload) => Promise<void | ErrorFields>, payload?: Payload): Promise<void>`

Triggers validation manually without a form element. Useful for validating arbitrary elements or building custom submission flows. Behaves the same as `formSubmit` — clears errors and sets `isSubmitted` on success, or merges returned errors on failure.

##### `errors`

`errors: Partial<Record<string, string>>`

Reactive store of current validation error messages, keyed by field name (from `name` attribute or `data-name`).

##### `isSubmitting`

`isSubmitting: () => boolean`

`true` while the submission callback is running.

##### `isSubmitted`

`isSubmitted: () => boolean`

`true` after a successful submission (callback returned `void`). Reset to `false` on the next input event.

##### `validateRef`

`validateRef(...validators: Validator[]): (ref: HTMLElement) => void`

Returns a `ref`-compatible function that registers an element with the form's validation context. Use this in place of `use:validate` when passing validation into child components as a prop.

```tsx
// with validators
<input ref={validateRef(minLength, isEmail)} name='email' />

// without validators (relies on native constraint validation only)
<input ref={validateRef()} name='username' required />
```

##### `validateField`

`validateField(fieldName: string): Promise<boolean>`

Validates a single field by name and returns `true` if valid, `false` if not. Scrolls to and focuses the element if validation fails.

##### `getFieldValue`

`getFieldValue(fieldName: string): string | undefined`

Returns the current value of a registered field's element.

## Custom Validation

Where `Falsy` is `false | 0 | '' | null | undefined | void`.

Validator functions receive an `HTMLElement` and return:

- `Falsy` for valid inputs.
- A `string` error message for invalid inputs.
- A `Promise<string | Falsy>` for async validation.

```tsx
import type { Validator } from '@sparkstone/solid-validation';

const minLength: Validator<HTMLInputElement> = el =>
  el.value.length < 5 && 'Must be at least 5 characters';

async function isUsernameTaken(el: HTMLInputElement) {
  const taken = await api.checkUsername(el.value);
  return taken ? 'Username is already taken' : undefined;
}
```

The `Validator` type is exported from the package and accepts a generic element type for stronger typing.

## PocketBase Integration

For integrating validation with [PocketBase](https://pocketbase.io/), this package includes helper functions. These are shipped as a separate bundle and will not be included in your build unless explicitly imported from `@sparkstone/solid-validation/pocketbase`.

### `prepareFormDataForPocketbase(formData: FormData, form: HTMLFormElement)`

Ensures unchecked checkboxes are properly submitted to PocketBase (which requires an explicit `false` value rather than omission).

```ts
import { prepareFormDataForPocketbase } from '@sparkstone/solid-validation/pocketbase';

async function onSubmit(form: HTMLFormElement) {
  const formData = new FormData(form);
  prepareFormDataForPocketbase(formData, form);
  await pocketbase.collection('users').create(formData);
}
```

### `parsePocketbaseError(error: PocketbaseError, rootErrorKey = 'form')`

Maps a PocketBase API error into a field-keyed error object compatible with `useForm`. Returns the result directly from your `formSubmit` callback to populate field errors:

```tsx
import { parsePocketbaseError } from '@sparkstone/solid-validation/pocketbase';

async function onSubmit(form: HTMLFormElement) {
  const formData = new FormData(form);
  try {
    await pocketbase.collection('users').create(formData);
  } catch (e) {
    return parsePocketbaseError(e);
    // e.g. { email: 'Invalid email address', password: 'Too short' }
  }
}
```

The optional `rootErrorKey` parameter (default `'form'`) sets the key used for the top-level error message when PocketBase returns a non-field-level error.
