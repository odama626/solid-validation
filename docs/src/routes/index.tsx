import { Title } from '@solidjs/meta';
import Demo from '../components/Demo';

export default function Overview() {
  return (
    <>
      <Title>solid-validation</Title>
      <h1>solid-validation</h1>
      <p>
        The browser already knows this field is invalid. This library puts that in a store you can
        render.
      </p>

      <Demo name='basic' title='A form with native and custom validation' />

      <p>That form is running the real library. Two directives, one store.</p>

      <p>
        <a href='/quick-start' role='button'>
          Quick start
        </a>
      </p>
    </>
  );
}
