import { isServer } from '@solidjs/web';
import { createEffect, createSignal, onCleanup } from 'solid-js';

/**
 * Live demos run the v1 library, which is Solid 1. The docs shell is Solid 2,
 * and two Solid runtimes cannot share one document, so each demo is its own
 * page loaded in an iframe. It reports its height back so the frame grows to
 * fit instead of getting an inner scrollbar.
 */
export default function Demo(props: { name: string; title: string }) {
  const [height, setHeight] = createSignal(300);
  let frame: HTMLIFrameElement | undefined;

  const scheme = () => {
    if (isServer) return 'light';
    return (
      document.documentElement.getAttribute('data-color-scheme') ??
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    );
  };

  const pushScheme = () =>
    frame?.contentWindow?.postMessage(
      { type: 'solid-validation-demo-scheme', scheme: scheme() },
      '*',
    );

  // Unconditional for the same reason as VersionSwitcher: an isServer branch
  // around a reactive node desynchronises the hydration key namespace.
  createEffect(
    () => undefined,
    () => {
    const onMessage = (event: MessageEvent) => {
      const data = event.data;
      if (data?.type !== 'solid-validation-demo-height') return;
      if (data.name !== props.name) return;
      setHeight(data.height);
    };
    window.addEventListener('message', onMessage);

    // Mirror the shell's light/dark choice into the frame when it changes.
    const observer = new MutationObserver(pushScheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-color-scheme'],
    });

    onCleanup(() => {
      window.removeEventListener('message', onMessage);
      observer.disconnect();
    });
    },
  );

  return (
    <iframe
      ref={frame}
      class='docs-demo-frame'
      src={`${import.meta.env.BASE_URL}demos/?d=${props.name}`}
      title={props.title}
      loading='lazy'
      onLoad={pushScheme}
      style={{ height: `${height()}px` }}
    />
  );
}
