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
    <form class='card not-content bg-base-100 border border-base-300 my-6' use:formSubmit={onSubmit}>
      <div class='card-body gap-3'>
        <p class='text-sm opacity-70'>
          Everything passes locally, then the server disagrees. Anything at{' '}
          <code class='kbd kbd-sm'>@example.com</code> comes back as a field error; an address
          starting with <code class='kbd kbd-sm'>down</code> comes back as a form-level error.
        </p>

        <Show when={errors.form}>
          <div role='alert' class='alert alert-error'>
            <span>{errors.form}</span>
          </div>
        </Show>

        <fieldset class='fieldset'>
          <legend class='fieldset-legend'>Email</legend>
          <input
            type='email'
            name='email'
            required
            use:validate
            class='input validator w-full'
            placeholder='ada@example.com'
          />
          <p class='text-error text-sm min-h-5'>{errors.email}</p>
        </fieldset>

        <div class='card-actions items-center gap-3'>
          <button type='submit' class='btn btn-primary' disabled={isSubmitting()}>
            {isSubmitting() && <span class='loading loading-spinner loading-xs' />}
            {isSubmitting() ? 'Signing up' : 'Sign up'}
          </button>
          {isSubmitted() && <span class='badge badge-success'>Account created</span>}
        </div>
      </div>
    </form>
  );
}
