import { createSignal } from 'solid-js';
import { createStore, SetStoreFunction } from 'solid-js/store';

type Falsy = false | 0 | '' | null | undefined | void;
type MaybePromise<T> = T | Promise<T>;

type ValidatorResponse = MaybePromise<string | Falsy>;

export type Validator<Element> = Falsy | ((el: Element) => ValidatorResponse);

type ValidatedElement = HTMLElement & { name: string };

type OnFormSubmit<ErrorFields extends Object, Payload> = (
  el: Payload,
) => MaybePromise<void | Partial<ErrorFields>>;

declare module 'solid-js' {
  namespace JSX {
    interface Directives {
      formSubmit: (callback: HTMLFormElement) => any;
      validate: boolean | Validator<any>[];
    }
  }
}
function checkValid<ErrorFields extends Object>(
  { element, validators = [] }: { element: HTMLInputElement; validators: Validator<unknown>[] },
  setErrors: SetStoreFunction<Partial<ErrorFields>>,
  errorClass?: string,
) {
  return async () => {
    element.setCustomValidity?.('');
    element.checkValidity?.();

    let message = element.validationMessage;
    if (!message) {
      for (const validator of validators) {
        if (!validator) continue;
        const text = await validator(element);
        if (text) {
          message = text;
          element.setCustomValidity?.(text);
          break;
        }
      }
    }
    if (message) {
      errorClass && element.classList.toggle(errorClass, true);
      element.setAttribute('aria-invalid', 'true');
      setErrors({
        [element.name ?? element.dataset.name]: message,
      } as Partial<ErrorFields>);
    }
    return message;
  };
}

export function useForm<ErrorFields extends Object>({ errorClass = '' } = {}) {
  const [errors, setErrors] = createStore<Partial<ErrorFields>>({});
  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [isSubmitted, setIsSubmitted] = createSignal(false);
  const fields: Partial<Record<keyof ErrorFields, { element: HTMLInputElement; validators: any }>> =
    {};

  const validate = <Element extends ValidatedElement>(
    ref: Element,
    accessor: () => Falsy | Validator<Element>[] = () => {},
  ) => {
    queueMicrotask(() => {
      let name = ref.name ?? ref.dataset.name;
      const accessorValue = accessor();
      const validators = Array.isArray(accessorValue) ? accessorValue : [];
      let config;
      fields[name] = config = { element: ref, validators };
      ref.onblur = () => {
        setIsSubmitted(false);
        return checkValid(config, setErrors, errorClass);
      };
      ref.oninput = () => {
        setIsSubmitted(false);
        if (!errors[name]) return;
        setErrors({ [name]: undefined } as Partial<ErrorFields>);
        ref.setAttribute('aria-invalid', 'false');
        errorClass && ref.classList.toggle(errorClass, false);
      };
    });
  };

  /**
   * Validate a field based on name
   * returns true if the field is valid
   **/
  async function validateField(fieldName: keyof ErrorFields): Promise<boolean> {
    const field = fields[fieldName];
    if (!field) return false;
    let error = await checkValid(field, setErrors, errorClass)();
    if (field.element.validationMessage || error) {
      field.element.focus();
      field.element.scrollIntoView({ behavior: 'smooth' });
    }
    return !errors[fieldName];
  }

  function getFieldValue(fieldName: keyof ErrorFields) {
    const field = fields[fieldName];
    return field?.element.value;
  }

  async function submit<Payload>(callback: OnFormSubmit<ErrorFields, Payload>, ref: Payload) {
    let errored = false;

    for (const k in fields) {
      const field = fields[k];
      if (!field) continue;
      let error = await checkValid(field, setErrors, errorClass)();
      if (!errored && (field.element.validationMessage || error)) {
        field.element.focus();
        field.element.scrollIntoView({ behavior: 'smooth' });
        if (document.contains(field.element)) {
          errored = true;
        } else {
          delete fields[k];
        }
      }
    }
    if (errored) return;
    setIsSubmitting(true);
    let callbackResult = await callback(ref);
    setIsSubmitting(false);
    if (callbackResult instanceof Object) {
      for (const name in callbackResult) {
        if (!(name in fields)) continue;
        fields[name]!.element.setAttribute('aria-invalid', 'true');
      }
      setErrors(callbackResult);
    } else {
      clearErrors();
      setIsSubmitted(true);
    }
  }

  function clearErrors() {
    setErrors(
      errors =>
        Object.fromEntries(
          Object.entries(errors).map(([key, value]) => [key, undefined]),
        ) as Partial<ErrorFields>,
    );
  }

  const formSubmit = (
    ref: HTMLFormElement,
    accessor: () => OnFormSubmit<ErrorFields, HTMLFormElement>,
  ) => {
    const callback = accessor() || (() => {});
    setIsSubmitted(false);

    ref.setAttribute('novalidate', '');

    ref.onsubmit = async e => {
      e.preventDefault();

      await submit(callback, ref);
    };

    ref.onreset = () => {
      clearErrors();
    };
  };

  return {
    validate,
    formSubmit,
    submit,
    errors,
    isSubmitting,
    isSubmitted,
    validateField,
    getFieldValue,
    validateRef:
      <Element extends ValidatedElement>(...args: Validator<Element>[]) =>
      (ref: Element) =>
        validate(ref, () => args),
  };
}
