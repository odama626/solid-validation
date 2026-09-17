import { useLocation } from '@solidjs/router';
import { For } from 'solid-js';

const sections = [
  {
    title: 'Start here',
    links: [
      { href: '/v1', label: 'Overview' },
      { href: '/v1/quick-start', label: 'Quick start' },
    ],
  },
  {
    title: 'Guides',
    links: [
      { href: '/v1/guides/validators', label: 'Writing validators' },
      { href: '/v1/guides/server-errors', label: 'Server-side errors' },
      { href: '/v1/guides/outside-forms', label: 'Outside a form' },
      { href: '/v1/guides/child-components', label: 'Child components' },
      { href: '/v1/guides/pocketbase', label: 'PocketBase' },
    ],
  },
  {
    title: 'API',
    links: [
      { href: '/v1/api/use-form', label: 'useForm' },
      { href: '/v1/api/types', label: 'Types' },
    ],
  },
  { title: 'Help', links: [{ href: '/v1/troubleshooting', label: 'Troubleshooting' }] },
];

export default function Sidebar() {
  // Links stay root-relative: prerender-crawler resolves them against the
  // output root, and a base-prefixed href makes it write a nested duplicate
  // tree. The deploy prefix is applied at deploy time, not in the markup.
  const location = useLocation();
  const isCurrent = (href: string) =>
    location.pathname.replace(/\/$/, '') === href.replace(/\/$/, '');

  return (
    <nav class='docs-nav' aria-label='Documentation'>
      <For each={sections}>
        {section => (
          <>
            <h2>{section.title}</h2>
            <ul>
              <For each={section.links}>
                {link => (
                  <li>
                    <a href={link.href} aria-current={isCurrent(link.href) ? 'page' : undefined}>
                      {link.label}
                    </a>
                  </li>
                )}
              </For>
            </ul>
          </>
        )}
      </For>
    </nav>
  );
}
