import { useForm } from '@sparkstone/solid-validation';
import { minLength, noSpaces } from './validators';

type Fields = { handle: string; bio: string };
type ValidateRef = ReturnType<typeof useForm<Fields>>['validateRef'];

/** The child decides its own rules; the parent never sees them. */
function HandleField(props: { validateRef: ValidateRef; error?: string }) {
  return (
    <fieldset>
      <legend>Handle</legend>
      <input
        type='text'
        name='handle'
        required
        ref={props.validateRef(minLength(3), noSpaces)}
        placeholder='ada'
      />
      <small class='docs-error'>{props.error}</small>
    </fieldset>
  );
}

export default function ChildComponentDemo() {
  const { formSubmit, validateRef, errors, isSubmitting, isSubmitted } = useForm<Fields>();

  return (
    <form
      use:formSubmit={() => {}}>
      <div>
        <p>
          <code>use:validate</code> is a directive and cannot cross a component
          boundary as a prop. <code>validateRef</code> can.
        </p>

        <HandleField validateRef={validateRef} error={errors.handle} />

        <div>
          <button type='submit' disabled={isSubmitting()}>
            Save
          </button>
          {isSubmitted() && <span>Saved</span>}
        </div>
      </div>
    </form>
  );
}
