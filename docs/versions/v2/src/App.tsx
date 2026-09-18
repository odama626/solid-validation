import { announceRoutes } from '@solidjs/prerender';
import { Title } from '@solidjs/meta';
import { Errored, Loading } from 'solid-js';
import Sidebar from './components/Sidebar';
import VersionSwitcher from './components/VersionSwitcher';
import { Router } from './router';
import './styles/app.scss';

export default function App() {
  // Tells the build which static pages exist, so a page nothing links to is
  // still rendered. A no-op in the browser.
  announceRoutes(Router);

  return (
    <Router>
      {props => (
        <>
          <Title>solid-validation</Title>
          <header class='docs-bar'>
            <p class='docs-bar__title'>
              <a href='/' class='semantic'>
                solid-validation
              </a>
            </p>
            <span class='docs-bar__spacer' />
            <VersionSwitcher />
            <a href='https://github.com/sparkstonepdx/solid-validation' class='secondary'>
              GitHub
            </a>
          </header>
          <div class='docs-shell'>
            <Sidebar />
            <main class='docs-main'>
              <Errored
                fallback={(error, reset) => (
                  <div role='alert'>
                    <h1>Something broke on this page</h1>
                    <p>{String(error())}</p>
                    <button onClick={reset}>Try again</button>
                  </div>
                )}>
                <Loading fallback={<p>Loading…</p>}>{props.children}</Loading>
              </Errored>
            </main>
          </div>
        </>
      )}
    </Router>
  );
}
