import { useForm } from '@sparkstone/solid-validation';
import { isUsernameAvailable, minLength } from './validators';

type Fields = { username: string };

export default function AsyncValidatorDemo() {
  const { formSubmit, validate, errors, isSubmitting, isSubmitted } = useForm<Fields>();

  return (
    <form
      class='card not-content bg-base-100 border border-base-300 my-6'
      use:formSubmit={() => {}}>
      <div class='card-body gap-3'>
        <p class='text-sm opacity-70'>
          Try <code class='kbd kbd-sm'>ada</code>, <code class='kbd kbd-sm'>grace</code> or{' '}
          <code class='kbd kbd-sm'>alan</code>. The availability check waits 600ms, and length is
          checked first so the slow call only runs when it has to.
        </p>

        <fieldset class='fieldset'>
          <legend class='fieldset-legend'>Username</legend>
          <input
            type='text'
            name='username'
            required
            use:validate={[minLength(3), isUsernameAvailable]}
            class='input validator w-full'
          />
          <p class='text-error text-sm min-h-5'>{errors.username}</p>
        </fieldset>

        <div class='card-actions items-center gap-3'>
          <button type='submit' class='btn btn-primary' disabled={isSubmitting()}>
            {isSubmitting() && <span class='loading loading-spinner loading-xs' />}
            {isSubmitting() ? 'Checking' : 'Claim username'}
          </button>
          {isSubmitted() && <span class='badge badge-success'>Available</span>}
        </div>
      </div>
    </form>
  );
}
