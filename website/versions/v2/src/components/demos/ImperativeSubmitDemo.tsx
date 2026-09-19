import { useForm } from '@sparkstone/solid-validation';
import { For, createSignal } from 'solid-js';

type Fields = { plan: string };

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const plans = ['Hobby', 'Studio', 'Agency'];

/**
 * submit() called from an inline-arrow onClick, which is the shape that never
 * fires under jsdom in the test suite. Every step reports what it did, so a
 * failure here says which half broke.
 */
export default function ImperativeSubmitDemo() {
  const [chosen, setChosen] = createSignal<string | null>(null);
  const [log, setLog] = createSignal<string[]>([]);
  const note = (line: string) => setLog(lines => [...lines, line]);

  const { validate, submit, errors, isSubmitting, isSubmitted } = useForm<Fields>();

  const planChosen = () => !chosen() && 'Choose a plan to continue';

  return (
    <div>
      <p>
        <small>
          Press Continue with no plan chosen and it should refuse. Choose one and it should say
          Continuing for 400ms, then Done. The log records every step.
        </small>
      </p>

      <fieldset ref={validate(() => [planChosen])} data-name='plan'>
        <legend>Plan</legend>
        <For each={plans}>
          {name => (
            <button
              type='button'
              aria-pressed={chosen() === name}
              onClick={() => {
                setChosen(name);
                note(`chose ${name}`);
              }}>
              {name}
            </button>
          )}
        </For>
      </fieldset>
      <small class='docs-error'>{errors.plan}</small>

      <footer>
        <button
          type='button'
          disabled={isSubmitting()}
          onClick={() => {
            note('Continue clicked');
            submit(async () => {
              note('callback started');
              await wait(400);
              note('callback finished');
            }).then(() => note('submit resolved'));
          }}>
          {isSubmitting() ? 'Continuing' : 'Continue'}
        </button>
        {isSubmitted() && <ins>Done</ins>}
      </footer>

      <ol>
        <For each={log()}>{line => <li>{line}</li>}</For>
      </ol>
    </div>
  );
}
