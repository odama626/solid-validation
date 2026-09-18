import{H as e}from"./dist-B5qRkI56.js";import{t}from"./MarkdownPage-UBS0bX0L.js";var n=`---
title: Types
---

## Validator

The only exported type.

\`\`\`ts
type Validator<Element> = Falsy | ((el: Element) => ValidatorResponse);
\`\`\`

The element type is a parameter, so annotate the element you are actually attaching to and get a typed argument:

\`\`\`ts
const minLength: Validator<HTMLInputElement> = el =>
  el.value.length < 5 && 'Use at least 5 characters';

const hasSelection: Validator<HTMLSelectElement> = el =>
  el.selectedIndex === 0 && 'Pick an option';
\`\`\`

\`Falsy\` is part of the union so a conditional entry type-checks without a cast:

\`\`\`tsx
<input use:validate={[required, needsMatch() && mustMatch]} />
\`\`\`

## Falsy

\`\`\`ts
type Falsy = false | 0 | '' | null | undefined | void;
\`\`\`

Everything that counts as passing. \`void\` is in the union so a validator that just runs \`if (bad) return message\` type-checks without an explicit \`return undefined\`.

## ValidatorResponse

\`\`\`ts
type ValidatorResponse = MaybePromise<string | Falsy>;
\`\`\`

A message, nothing, or a promise of either.

## JSX.Directives

The package augments Solid's directive interface:

\`\`\`ts
declare module 'solid-js' {
  namespace JSX {
    interface Directives {
      formSubmit: (callback: HTMLFormElement) => any;
      validate: boolean | Validator<any>[];
    }
  }
}
\`\`\`

The augmentation is applied by importing anything from the package. Two things follow from these signatures:

\`validate\` accepts \`boolean\`, which is what makes bare \`use:validate\` with no value valid. Passing \`true\` explicitly is the same as passing nothing.

\`validate\` is typed as \`Validator<any>[]\`, so the array does not narrow to your element. Annotate each validator with its own \`Validator<HTMLInputElement>\` to keep the element typed.

## Typing errors

\`useForm<ErrorFields>\` sets the shape of the store:

\`\`\`ts
type SignupFields = {
  email: string;
  password: string;
  form: string;
};

const { errors } = useForm<SignupFields>();
\`\`\`

Include your form-level keys in the type. They are not tied to any field, but they are keys in the same store, and leaving them out makes \`errors.form\` a type error.

\`validateField\` and \`getFieldValue\` both take \`keyof ErrorFields\`, so a form-level key is accepted there too even though no element is registered under it. Both are defined to handle a missing field: \`validateField\` resolves \`false\` and \`getFieldValue\` returns \`undefined\`.
`;function r(){return e(t,{source:n})}export{r as default};