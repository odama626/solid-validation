import { useForm } from '@sparkstone/solid-validation';
import { Show } from 'solid-js';
import { wait } from './validators';

type Fields = { email: string; form: string };

export default function ServerErrorDemo() {
  const { formSubmit, validate, errors, isSubmitting, isSubmitted } = useForm<Fields>();

  async function onSubmit(form: HTMLFormElement) {
    await wait(600);
    const email = String(new FormData(form).get('email') ?? '');

    if (email.endsWith('@example.com')) return { email: 'That domain is not accepted' };
    if (email.startsWith('down')) {
      return { form: 'The signup service is unavailable. Try again in a minute.' };
    }
  }

  return (
    <form use:formSubmit={onSubmit}>
      <div>
        <p>
          Everything passes locally, then the server disagrees. Anything at{' '}
          <code>@example.com</code> comes back as a field error; an address
          starting with <code>down</code> comes back as a form-level error.
        </p>

        <Show when={errors.form}>
          <div role='alert'>
            <span>{errors.form}</span>
          </div>
        </Show>

        <fieldset>
          <legend>Email</legend>
          <input
            type='email'
            name='email'
            required
            use:validate
            placeholder='ada@example.com'
          />
          <small class='docs-error'>{errors.email}</small>
        </fieldset>

        <div>
          <button type='submit' disabled={isSubmitting()}>
            {isSubmitting() && <span />}
            {isSubmitting() ? 'Signing up' : 'Sign up'}
          </button>
          {isSubmitted() && <span>Account created</span>}
        </div>
      </div>
    </form>
  );
}
