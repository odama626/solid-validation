import { useLocation } from '@solidjs/router';
import { For } from 'solid-js';

const sections = [
  {
    title: 'Start here',
    links: [
      { href: '/', label: 'Overview' },
      { href: '/quick-start', label: 'Quick start' },
    ],
  },
  {
    title: 'Guides',
    links: [
      { href: '/guides/validators', label: 'Writing validators' },
      { href: '/guides/server-errors', label: 'Server-side errors' },
      { href: '/guides/outside-forms', label: 'Outside a form' },
      { href: '/guides/child-components', label: 'Child components' },
      { href: '/guides/pocketbase', label: 'PocketBase' },
    ],
  },
  {
    title: 'API',
    links: [
      { href: '/api/use-form', label: 'useForm' },
      { href: '/api/types', label: 'Types' },
    ],
  },
  { title: 'Help', links: [{ href: '/troubleshooting', label: 'Troubleshooting' }] },
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
