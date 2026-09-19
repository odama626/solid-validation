import { useForm } from '@sparkstone/solid-validation';

type Fields = { plan: string };

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const plans = ['Hobby', 'Studio', 'Agency'];

/**
 * submit() called from an inline-arrow onClick. This is the exact shape that
 * never fires under jsdom in the test suite, so it is the one to check in a
 * real browser.
 */
export default function ImperativeSubmitDemo() {
  let chosen: string | null = null;
  const { validate, submit, errors, isSubmitting, isSubmitted } = useForm<Fields>();

  const planChosen = () => !chosen && 'Choose a plan to continue';

  return (
    <div>
      <p>
        <small>
          No form element. The button calls <code>submit()</code> from a click handler, and the
          plan group is registered with <code>data-name</code>.
        </small>
      </p>

      <div ref={validate(() => [planChosen])} data-name='plan'>
        {plans.map(name => (
          <button type='button' onClick={() => (chosen = name)}>
            {name}
          </button>
        ))}
      </div>
      <small class='docs-error'>{errors.plan}</small>

      <footer>
        <button
          type='button'
          disabled={isSubmitting()}
          onClick={() => submit(async () => void (await wait(400)))}>
          {isSubmitting() ? 'Continuing' : 'Continue'}
        </button>
        {isSubmitted() && <ins>{chosen} selected</ins>}
      </footer>
    </div>
  );
}
