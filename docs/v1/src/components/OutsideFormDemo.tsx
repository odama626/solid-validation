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
    <div>
      <div>
        <p>
          No form element and no input. The group of buttons is registered with{' '}
          <code>data-name</code>, and <code>submit()</code>{' '}
          validates it on click.
        </p>

        <fieldset>
          <legend>Plan</legend>
          <div
            use:validate={[planChosen]}
            data-name='plan'>
            <For each={plans}>
              {name => (
                <button
                  type='button'
                  classList={{ 'btn-primary': plan() === name }}
                  aria-pressed={plan() === name}
                  onClick={() => setPlan(name)}>
                  {name}
                </button>
              )}
            </For>
          </div>
          <small class='docs-error'>{errors.plan}</small>
        </fieldset>

        <div>
          <button
            type='button'
            disabled={isSubmitting()}
            onClick={() => submit(async () => void (await wait(400)))}>
            {isSubmitting() && <span />}
            {isSubmitting() ? 'Continuing' : 'Continue'}
          </button>
          {isSubmitted() && <span>{plan()} selected</span>}
        </div>
      </div>
    </div>
  );
}
