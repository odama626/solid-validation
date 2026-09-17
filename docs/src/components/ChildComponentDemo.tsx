import { useForm } from '@sparkstone/solid-validation';
import { minLength, noSpaces } from './validators';

type Fields = { handle: string; bio: string };
type ValidateRef = ReturnType<typeof useForm<Fields>>['validateRef'];

/** The child decides its own rules; the parent never sees them. */
function HandleField(props: { validateRef: ValidateRef; error?: string }) {
  return (
    <fieldset class='fieldset'>
      <legend class='fieldset-legend'>Handle</legend>
      <input
        type='text'
        name='handle'
        required
        ref={props.validateRef(minLength(3), noSpaces)}
        class='input validator w-full'
        placeholder='ada'
      />
      <p class='text-error text-sm min-h-5'>{props.error}</p>
    </fieldset>
  );
}

export default function ChildComponentDemo() {
  const { formSubmit, validateRef, errors, isSubmitting, isSubmitted } = useForm<Fields>();

  return (
    <form
      class='card not-content bg-base-100 border border-base-300 my-6'
      use:formSubmit={() => {}}>
      <div class='card-body gap-3'>
        <p class='text-sm opacity-70'>
          <code class='kbd kbd-sm'>use:validate</code> is a directive and cannot cross a component
          boundary as a prop. <code class='kbd kbd-sm'>validateRef</code> can.
        </p>

        <HandleField validateRef={validateRef} error={errors.handle} />

        <div class='card-actions items-center gap-3'>
          <button type='submit' class='btn btn-primary' disabled={isSubmitting()}>
            Save
          </button>
          {isSubmitted() && <span class='badge badge-success'>Saved</span>}
        </div>
      </div>
    </form>
  );
}
