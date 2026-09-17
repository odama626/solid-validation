import { render } from 'solid-js/web';
import { Show, createSignal, lazy } from 'solid-js';
import '@sparkstone/css/src/theme.scss';
import './demo.css';

const demos: Record<string, () => Promise<{ default: () => any }>> = {
  basic: () => import('./BasicFormDemo'),
  async: () => import('./AsyncValidatorDemo'),
  server: () => import('./ServerErrorDemo'),
  outside: () => import('./OutsideFormDemo'),
  child: () => import('./ChildComponentDemo'),
};

const name = new URLSearchParams(location.search).get('d') ?? 'basic';
const loader = demos[name];

function App() {
  if (!loader) return <p>Unknown demo: {name}</p>;
  const Demo = lazy(loader);
  return <Demo />;
}

render(() => <App />, document.getElementById('root')!);

// Report height to the docs shell so the iframe can size itself. Without this
// every demo would sit in a fixed-height box with its own scrollbar.
function reportHeight() {
  const height = Math.ceil(document.documentElement.getBoundingClientRect().height);
  parent.postMessage({ type: 'solid-validation-demo-height', name, height }, '*');
}

new ResizeObserver(reportHeight).observe(document.documentElement);
window.addEventListener('load', reportHeight);

// The shell owns the colour scheme; mirror whatever it tells us.
window.addEventListener('message', event => {
  const data = event.data;
  if (data?.type !== 'solid-validation-demo-scheme') return;
  document.documentElement.setAttribute('data-color-scheme', data.scheme);
});
