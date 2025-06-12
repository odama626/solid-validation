# @sparkstone/solid-validation

A lightweight and flexible validation library for Solid.js. It provides a simple API to validate form inputs, handle submission state, and manage error messages. It now also supports validation outside of forms and inputs.

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

  - Basic Example
  - Non-Form Validation

- [API](#api)

  - `useForm(options?: { errorClass?: string })`

    - `validate`
    - `formSubmit`
    - `submit`
    - `errors`
    - `isSubmitting`
    - `isSubmitted`
    - `validateRef`
    - `validateField`
    - `getFieldValue`

- [Custom Validation](#custom-validation)
- [PocketBase Integration](#pocketbase-integration)

## Usage

### Basic Example (Form Based)

```tsx
import { createSignal } from 'solid-js';
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

function required(el: HTMLInputElement) {
  return el.value.trim() ? false : 'This field is required';
}
```

### Validation Outside of Forms and Inputs

You can now validate any element, not just form inputs:

```tsx
<div use:validate={[myCustomValidator]} data-name='customField'></div>
```

- When using `use:validate` on non-input elements, you **must** supply a `data-name` attribute for error tracking.
- Validation can also be triggered manually using the `submit()` function, even without a form.
- On validation failure, the library will automatically scroll the invalid element into view and focus it if possible.

## API

### `useForm(options?: { errorClass?: string })`

Creates a validation context.

#### Returns:

- `validate(ref: HTMLElement, validators?: Validator[])`
  Registers an element for validation. Can be used on both form inputs and other HTML elements.

- `formSubmit(ref: HTMLFormElement, callback: OnFormSubmit)`
  Handles form submission, running all validations.

- `submit(): Promise<boolean>`
  Triggers validation manually. Useful for standalone validations without a form.

- `errors: Partial<Record<string, string>>`
  Reactive store of validation errors.

- `isSubmitting: () => boolean`
  Tracks whether the form is currently submitting.

- `isSubmitted: () => boolean`
  Tracks whether the form was successfully submitted.

- `validateRef: (...args: Parameters<typeof validate>) => (ref: HTMLElement) => void`
  Pass this in with `ref={validateRef()}` for programmatic attachment.

- `validateField(fieldName: keyof ErrorFields): Promise<boolean>`
  Validates a field by name. Automatically scrolls and focuses failing elements.

- `getFieldValue(fieldName: keyof ErrorFields)`
  Retrieves the current value of the field.

## Custom Validation

Validator functions receive an `HTMLElement` and return:

- `false | '' | null | undefined` for valid inputs.
- A `string` error message for invalid inputs.
- Or a `Promise<string | Falsy>` for async validation.

Example:

```tsx
function minLength(el: HTMLInputElement) {
  return el.value.length < 5 && 'Must be at least 5 characters';
}
```

## PocketBase Integration

For integrating validation with [PocketBase](https://pocketbase.io/), this package includes helper functions:

### `prepareFormDataForPocketbase(formData: FormData, form: HTMLFormElement)`

Ensures unchecked checkboxes are properly submitted to PocketBase.

Example:

```ts
import { prepareFormDataForPocketbase } from '@sparkstone/solid-validation/pocketbase';

function handleSubmit(event: Event) {
  event.preventDefault();
  const form = event.currentTarget as HTMLFormElement;
  const formData = new FormData(form);

  prepareFormDataForPocketbase(formData, form);
}
```

### `parsePocketbaseError(error: PocketbaseError, rootErrorKey = 'form')`

Extracts error messages from PocketBase responses:

```ts
import { parsePocketbaseError } from '@sparkstone/solid-validation/pocketbase';

async function handleSubmit(event: Event) {
  event.preventDefault();
  const form = event.currentTarget as HTMLFormElement;
  const formData = new FormData(form);

  try {
    await pocketbase.collection('users').create(formData);
  } catch (e) {
    const errors = parsePocketbaseError(e);
    console.log(errors);
  }
}
```

---

These tools simplify form handling and error mapping when using PocketBase with Solid.js.
