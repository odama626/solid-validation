import { useForm } from '@sparkstone/solid-validation';
import { isUsernameAvailable, minLength } from './validators';

type Fields = { username: string };

export default function AsyncValidatorDemo() {
  const { formSubmit, validate, errors, isSubmitting, isSubmitted } = useForm<Fields>();

  return (
    <form
      use:formSubmit={() => {}}>
      <div>
        <p>
          Try <code>ada</code>, <code>grace</code> or{' '}
          <code>alan</code>. The availability check waits 600ms, and length is
          checked first so the slow call only runs when it has to.
        </p>

        <fieldset>
          <legend>Username</legend>
          <input
            type='text'
            name='username'
            required
            use:validate={[minLength(3), isUsernameAvailable]}
          />
          <small class='docs-error'>{errors.username}</small>
        </fieldset>

        <div>
          <button type='submit' disabled={isSubmitting()}>
            {isSubmitting() && <span />}
            {isSubmitting() ? 'Checking' : 'Claim username'}
          </button>
          {isSubmitted() && <span>Available</span>}
        </div>
      </div>
    </form>
  );
}
