import { createSignal } from "solid-js";
import { createStore, SetStoreFunction } from "solid-js/store";

type Falsy = false | 0 | "" | null | undefined;
type MaybePromise<T> = T | Promise<T>;

type ValidatorResponse = MaybePromise<string | Falsy>;

type Validator = (el: HTMLInputElement) => ValidatorResponse;

type OnFormSubmit<ErrorFields extends Object> = (
  el: HTMLFormElement,
) => MaybePromise<void | Partial<ErrorFields>>;

declare module "solid-js" {
  namespace JSX {
    interface Directives {
      formSubmit: (callback: HTMLFormElement) => any;
      validate: boolean | Validator[];
    }
  }
}
function checkValid<ErrorFields extends Object>(
  {
    element,
    validators = [],
  }: { element: HTMLInputElement; validators: Validator[] },
  setErrors: SetStoreFunction<Partial<ErrorFields>>,
  errorClass?: string,
) {
  return async () => {
    element.setCustomValidity("");
    element.checkValidity();
    let message = element.validationMessage;
    if (!message) {
      for (const validator of validators) {
        const text = await validator(element);
        if (text) {
          element.setCustomValidity(text);
          break;
        }
      }
      message = element.validationMessage;
    }
    if (message) {
      errorClass && element.classList.toggle(errorClass, true);
      element.setAttribute("aria-invalid", "true");
      setErrors({ [element.name]: message } as Partial<ErrorFields>);
    }
  };
}

export function useForm<ErrorFields extends Object>({ errorClass = "" } = {}) {
  const [errors, setErrors] = createStore<Partial<ErrorFields>>({});
  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [isSubmitted, setIsSubmitted] = createSignal(false);
  const fields: Record<string, { element: HTMLInputElement; validators: any }> =
    {};

  const validate = (ref: HTMLInputElement, accessor = () => {}) => {
    queueMicrotask(() => {
      const accessorValue = accessor();
      const validators = Array.isArray(accessorValue) ? accessorValue : [];
      let config;
      fields[ref.name] = config = { element: ref, validators };
      ref.onblur = () => {
        setIsSubmitted(false);
        return checkValid(config, setErrors, errorClass);
      };
      ref.oninput = () => {
        setIsSubmitted(false);
        if (!errors[ref.name]) return;
        setErrors({ [ref.name]: undefined } as Partial<ErrorFields>);
        ref.setAttribute("aria-invalid", "false");
        errorClass && ref.classList.toggle(errorClass, false);
      };
    });
  };

  const formSubmit = (
    ref: HTMLFormElement,
    accessor: () => OnFormSubmit<ErrorFields>,
  ) => {
    const callback = accessor() || (() => {});
    setIsSubmitted(false);
    ref.setAttribute("novalidate", "");
    ref.onsubmit = async (e) => {
      e.preventDefault();
      let errored = false;

      for (const k in fields) {
        const field = fields[k];
        await checkValid(field, setErrors, errorClass)();
        if (!errored && field.element.validationMessage) {
          field.element.focus();
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
          fields[name].element.setAttribute("aria-invalid", "true");
        }
        setErrors(callbackResult);
      } else {
        clearErrors();
        setIsSubmitted(true);
      }
    };

    function clearErrors() {
      setErrors(
        (errors) =>
          Object.fromEntries(
            Object.entries(errors).map(([key, value]) => [key, undefined]),
          ) as Partial<ErrorFields>,
      );
    }

    ref.onreset = () => {
      clearErrors();
    };
  };

  return {
    validate,
    formSubmit,
    errors,
    isSubmitting,
    isSubmitted,
    validateRef:
      (...args: Parameters<typeof validate>) =>
      (ref: HTMLInputElement) =>
        validate(ref, () => args),
  };
}
