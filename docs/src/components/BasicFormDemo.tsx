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
    <form
      class='card not-content bg-base-100 border border-base-300 my-6'
      use:formSubmit={onSubmit}>
      <div class='card-body gap-3'>
        <p class='text-sm opacity-70'>
          Tab out of a field without filling it in. Validation runs on blur, and the error clears
          the moment you start typing again.
        </p>

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

        <fieldset class='fieldset'>
          <legend class='fieldset-legend'>Handle</legend>
          <input
            type='text'
            name='handle'
            required
            use:validate={[minLength(3), noSpaces]}
            class='input validator w-full'
            placeholder='ada'
          />
          <p class='text-error text-sm min-h-5'>{errors.handle}</p>
        </fieldset>

        <div class='card-actions items-center gap-3'>
          <button type='submit' class='btn btn-primary' disabled={isSubmitting()}>
            {isSubmitting() && <span class='loading loading-spinner loading-xs' />}
            {isSubmitting() ? 'Saving' : 'Save'}
          </button>
          <button type='reset' class='btn btn-ghost'>
            Reset
          </button>
          {isSubmitted() && <span class='badge badge-success'>Saved</span>}
        </div>
      </div>
    </form>
  );
}
