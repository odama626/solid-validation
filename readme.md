# @sparkstone/solid-validation

A lightweight and flexible form validation library for Solid.js. It provides a simple API to validate form inputs, handle submission state, and manage error messages.

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
- [API](#api)
  - `useForm(options?)`
    - `validate`
    - `formSubmit`
    - `errors`
    - `isSubmitting`
    - `isSubmitted`
    - `validateRef`
- [Custom Validation](#custom-validation)
  - Example Validator
- [PocketBase Integration](#pocketbase-integration)
  - `prepareFormDataForPocketbase`
  - `parsePocketbaseError`

## Usage

### Basic Example

```tsx
import { createSignal } from "solid-js";
import { useForm } from "@sparkstone/solid-validation";

function min5Characters(el: HTMLInputElement) {
  if (el.value.length < 5) {
    return "must be at least 5 characters long";
  }
}

function MyForm() {
  const { formSubmit, validate, errors, isSubmitting, isSubmitted } = useForm();

  async function onSubmit(form) {
    const formData = new FormData(form);

    try {
      // await submit form
    } catch (e) {
      return {
        myCustomFormError: e.message,
      };
    }
  }

  return (
    <form use:formSubmit={onSubmit}>
      <input
        type="text"
        name="username"
        placeholder="Enter username"
        required
        use:validate
      />
      <span>{errors.username}</span>

      <input
        type="text"
        name="message"
        placeholder="Enter message"
        required
        use:validate={[min5Charaters]}
      />
      <span>{errors.message}</span>

      <span>{errors.myCustomFormError}</span>

      <button type="submit" disabled={isSubmitting()}>
        {isSubmitting() ? "Submitting..." : "Submit"}
      </button>

      {isSubmitted() && <p>Form successfully submitted!</p>}
    </form>
  );
}

function required(el: HTMLInputElement) {
  return el.value.trim() ? false : "This field is required";
}
```

## API

### `useForm(options?: { errorClass?: string })`

Creates a form validation context.

#### Returns:

- `validate(ref: HTMLInputElement, validators?: Validator[])`
  - Registers an input for validation.
- `formSubmit(ref: HTMLFormElement, callback: OnFormSubmit)`
  - Handles form submission, running all validations.
- `errors: Partial<Record<string, string>>`
  - Reactive store of validation errors.
- `isSubmitting: () => boolean`
  - Tracks whether the form is currently submitting.
- `isSubmitted: () => boolean`
  - Tracks whether the form was successfully submitted.
- `validateRef: (...args: Parameters<typeof validate>) => (ref: HTMLInputElement) => void`
  - if you're validating a custom element you can pass this in with `ref={validateRef()}`

### Custom Validation

A validator function receives an `HTMLInputElement` and returns:

- `false | "" | null | undefined` for valid inputs.
- A `string` error message for invalid inputs.
- A `Promise<string | Falsy>` for async validation.

Example:

```tsx
function minLength(el: HTMLInputElement) {
  return el.value.length < 5 && "Must be at least 5 characters";
}
```

## PocketBase Integration

For integrating form validation with [PocketBase](https://pocketbase.io/), this package provides helper functions to prepare form data and handle errors from PocketBase responses.

### `prepareFormDataForPocketbase(formData: FormData, form: HTMLFormElement)`

PocketBase does not include unchecked checkboxes in `FormData` submissions. This function ensures that all checkbox fields are included, defaulting to `"false"` if unchecked.

#### Example:

```ts
import { prepareFormDataForPocketbase } from "@sparkstone/solid-validation/pocketbase";

function handleSubmit(event: Event) {
  event.preventDefault();
  const form = event.currentTarget as HTMLFormElement;
  const formData = new FormData(form);

  prepareFormDataForPocketbase(formData, form);

  // Now formData is ready to be sent to PocketBase
}
```

### `parsePocketbaseError(error: PocketbaseError, rootErrorKey = "form")`

PocketBase API errors return a structured `data` object. This function extracts error messages and formats them for easy use in your validation logic.

#### Example:

```ts
import { parsePocketbaseError } from "@sparkstone/solid-validation/pocketbase";

async function handleSubmit(event: Event) {
  event.preventDefault();
  const form = event.currentTarget as HTMLFormElement;
  const formData = new FormData(form);

  try {
    // Replace with your PocketBase API call
    await pocketbase.collection("users").create(formData);
  } catch (e) {
    const errors = parsePocketbaseError(e);
    console.log(errors); // { email: "Invalid email", password: "Too short", form: "Something went wrong" }
  }
}
```

This allows for easy mapping of errors to form fields and a general error message under the `"form"` key.

---

These functions help streamline form submissions and error handling when using PocketBase as your backend.
