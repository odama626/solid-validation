import { useForm } from '@sparkstone/solid-validation';
import { minLength, noSpaces, wait } from './validators';

type Fields = { email: string; handle: string };

export default function BasicFormDemo() {
  const { formSubmit, validate, errors, isSubmitting, isSubmitted } = useForm<Fields>();

  async function onSubmit(form: HTMLFormElement) {
    await wait(500);
    console.log(Object.fromEntries(new FormData(form)));
  }

  return (
    <article class='docs-demo'>
      <form use:formSubmit={onSubmit}>
        <p>
          <small>
            Tab out of a field without filling it in. Validation runs on blur, and the error
            clears the moment you start typing again.
          </small>
        </p>

        <label for='demo-email'>
          Email
          <input id='demo-email' type='email' name='email' required use:validate />
        </label>
        <small class='docs-error'>{errors.email}</small>

        <label for='demo-handle'>
          Handle
          <input
            id='demo-handle'
            type='text'
            name='handle'
            required
            use:validate={[minLength(3), noSpaces]}
          />
        </label>
        <small class='docs-error'>{errors.handle}</small>

        <footer class='flex'>
          <button type='submit' aria-busy={isSubmitting()} disabled={isSubmitting()}>
            {isSubmitting() ? 'Saving' : 'Save'}
          </button>
          <button type='reset' class='secondary'>
            Reset
          </button>
          {isSubmitted() && <ins>Saved</ins>}
        </footer>
      </form>
    </article>
  );
}
