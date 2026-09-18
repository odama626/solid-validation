/**
 * v2 documents the 2.x library, which does not exist yet. Once it does, demos
 * become ordinary imports rendered inline: this site and the library both run
 * Solid 2, so there is no runtime to isolate and no iframe needed.
 */
export default function Demo(props: { name: string; title: string }) {
  return (
    <aside class='docs-demo-pending' role='note'>
      <strong>{props.title}</strong>
      <p>
        Live demo pending the 2.x library release. See the same example running in the{' '}
        <a href={`${import.meta.env.BASE_URL}v1/`}>v1 documentation</a>.
      </p>
    </aside>
  );
}
