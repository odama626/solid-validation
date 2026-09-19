import { lazy } from 'solid-js';

/**
 * v2 documents the 2.x library, and this site runs Solid 2 as well, so demos
 * are ordinary components rendered inline. No iframe, no second runtime.
 */
const demos: Record<string, () => Promise<{ default: () => any }>> = {
  submit: () => import('./demos/SubmitDemo'),
  'imperative-submit': () => import('./demos/ImperativeSubmitDemo'),
};

export default function Demo(props: { name: string; title: string }) {
  const loader = demos[props.name];
  if (!loader) {
    return (
      <aside class='docs-demo-pending' role='note'>
        <strong>{props.title}</strong>
        <p>Demo not written yet.</p>
      </aside>
    );
  }

  const Loaded = lazy(loader);
  return (
    <section class='docs-demo' aria-label={props.title}>
      <Loaded />
    </section>
  );
}
