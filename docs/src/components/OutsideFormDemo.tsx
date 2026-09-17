import { useForm } from '@sparkstone/solid-validation';
import { For, createSignal } from 'solid-js';
import { wait } from './validators';

type Fields = { plan: string };

const plans = ['Hobby', 'Studio', 'Agency'];

export default function OutsideFormDemo() {
  const [plan, setPlan] = createSignal<string | null>(null);
  const { validate, submit, errors, isSubmitting, isSubmitted } = useForm<Fields>();

  const planChosen = () => !plan() && 'Choose a plan to continue';

  return (
    <div class='card not-content bg-base-100 border border-base-300 my-6'>
      <div class='card-body gap-3'>
        <p class='text-sm opacity-70'>
          No form element and no input. The group of buttons is registered with{' '}
          <code class='kbd kbd-sm'>data-name</code>, and <code class='kbd kbd-sm'>submit()</code>{' '}
          validates it on click.
        </p>

        <fieldset class='fieldset'>
          <legend class='fieldset-legend'>Plan</legend>
          <div
            use:validate={[planChosen]}
            data-name='plan'
            class='join aria-[invalid=true]:outline aria-[invalid=true]:outline-error rounded-field'>
            <For each={plans}>
              {name => (
                <button
                  type='button'
                  class='btn join-item'
                  classList={{ 'btn-primary': plan() === name }}
                  aria-pressed={plan() === name}
                  onClick={() => setPlan(name)}>
                  {name}
                </button>
              )}
            </For>
          </div>
          <p class='text-error text-sm min-h-5'>{errors.plan}</p>
        </fieldset>

        <div class='card-actions items-center gap-3'>
          <button
            type='button'
            class='btn btn-primary'
            disabled={isSubmitting()}
            onClick={() => submit(async () => void (await wait(400)))}>
            {isSubmitting() && <span class='loading loading-spinner loading-xs' />}
            {isSubmitting() ? 'Continuing' : 'Continue'}
          </button>
          {isSubmitted() && <span class='badge badge-success'>{plan()} selected</span>}
        </div>
      </div>
    </div>
  );
}
