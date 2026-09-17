---
title: useForm
description: Full API reference for useForm and everything it returns.
---

```ts
function useForm<ErrorFields extends Object>(options?: { errorClass?: string }): FormApi;
```

Creates an isolated form context: one error store, one field registry, one pair of submission signals. Call it once per form.

The `ErrorFields` type parameter names the keys of the `errors` store. It is optional, and without it `errors` is loosely typed.

```ts
type Fields = { email: string; password: string };
const { errors } = useForm<Fields>();
```

### options.errorClass

A class name toggled on any element that fails validation, alongside `aria-invalid="true"`. Removed on the next input into that field. Omit it to style against `aria-invalid` only.

---

## validate

```ts
validate(ref: HTMLElement, accessor?: () => Validator[] | Falsy): void
```

Registers an element, used as a directive.

```tsx
<input name='email' required use:validate />
<input name='handle' use:validate={[minLength(3)]} />
```

Registration is deferred to a microtask, so a field is not queryable in the same synchronous tick it renders in. Attaches `blur` and `input` handlers by assigning `onblur` and `oninput`, which replaces any handler already assigned that way on the same element.

The store key comes from `name`, falling back to `data-name`.

---

## formSubmit

```ts
formSubmit(ref: HTMLFormElement, accessor: () => OnFormSubmit): void
```

Takes over a form's submit event, used as a directive.

```tsx
<form use:formSubmit={onSubmit}>
```

On attach it sets `novalidate` on the form. On submit it calls `preventDefault()` and runs the same sequence as `submit`, passing the form element to your callback. On reset it clears every error.

---

## submit

```ts
submit<Payload>(
  callback: (payload: Payload) => MaybePromise<void | Partial<ErrorFields>>,
  payload?: Payload,
): Promise<void>
```

Runs validation and, if everything passes, the callback. Use it when there is no form element.

1. Every registered field is checked in registration order.
2. The first failing field still in the document is focused and scrolled into view, and the submission stops.
3. Failing fields that have been removed from the document are dropped from the registry rather than blocking.
4. `isSubmitting` becomes `true`, the callback runs, `isSubmitting` becomes `false`.
5. A returned object is merged into `errors`. Anything else clears all errors and sets `isSubmitted`.

An exception thrown by the callback propagates and leaves `isSubmitting` at `true`. Catch inside the callback.

---

## errors

```ts
errors: Partial<ErrorFields>
```

A Solid store proxy of current messages, keyed by field name. Reading `errors.email` in JSX subscribes to that key alone. Keys that match no registered field are allowed and are how form-level messages are rendered.

---

## isSubmitting

```ts
isSubmitting: () => boolean
```

`true` from the moment validation passes until the callback settles. Field checks that fail before the callback runs never flip it, so it does not flash on a failed submit.

---

## isSubmitted

```ts
isSubmitted: () => boolean
```

`true` after a submission whose callback returned no errors. Reset to `false` by any input into a registered field, by the next submit, and when `formSubmit` attaches.

---

## validateRef

```ts
validateRef(...validators: Validator[]): (ref: HTMLElement) => void
```

Returns a ref-compatible function that registers an element. The value form of `use:validate`, for fields inside child components. Validators are passed as arguments rather than as an array.

```tsx
<input name='email' required ref={validateRef(isCorporateAddress)} />
```

See [Child components](/solid-validation/guides/child-components/).

---

## validateField

```ts
validateField(fieldName: keyof ErrorFields): Promise<boolean>
```

Checks one field and resolves to whether it passed. Focuses and scrolls to the element on failure. Returns `false` for a field that was never registered, so a typo in the name reads as invalid rather than throwing.

Useful for multi-step forms, where a step is gated on a subset of fields:

```ts
if (!(await validateField('email'))) return;
goToStep(2);
```

---

## getFieldValue

```ts
getFieldValue(fieldName: keyof ErrorFields): string | undefined
```

Reads the current `value` of a registered field's element. Returns `undefined` for an unregistered field, and for elements with no `value` property such as a `div`.

This is a direct DOM read, not a reactive source. It does not track in an effect or memo. For cross-field rules, read the other element inside a validator instead:

```ts
const mustMatch: Validator<HTMLInputElement> = el =>
  el.value !== getFieldValue('password') && 'Passwords do not match';
```
