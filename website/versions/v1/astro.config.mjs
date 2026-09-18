import solid from '@astrojs/solid-js';
import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';

const src = path => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  site: 'https://sparkstonepdx.github.io',
  base: '/solid-validation/v1',
  integrations: [
    solid(),
    starlight({
      title: 'solid-validation',
      description:
        'Form validation for Solid.js that builds on the browser\u2019s own constraint validation.',
      social: {
        github: 'https://github.com/sparkstonepdx/solid-validation',
      },
      editLink: {
        baseUrl: 'https://github.com/sparkstonepdx/solid-validation/edit/main/website/versions/v1/',
      },
      components: {
        SocialIcons: './src/components/HeaderEnd.astro',
      },
      customCss: [
        '@fontsource-variable/inter',
        '@fontsource/ibm-plex-mono/400.css',
        '@fontsource/ibm-plex-mono/600.css',
        './src/styles/demo.css',
        '@sparkstone/css/classless',
        './src/styles/theme.css',
      ],
      sidebar: [
        { label: 'Quick start', link: '/quick-start/' },
        {
          label: 'Guides',
          items: [
            { label: 'Writing validators', link: '/guides/validators/' },
            { label: 'Server-side errors', link: '/guides/server-errors/' },
            { label: 'Outside a form', link: '/guides/outside-forms/' },
            { label: 'Child components', link: '/guides/child-components/' },
            { label: 'PocketBase', link: '/guides/pocketbase/' },
          ],
        },
        {
          label: 'API',
          items: [
            { label: 'useForm', link: '/reference/use-form/' },
            { label: 'Types', link: '/reference/types/' },
          ],
        },
        { label: 'Troubleshooting', link: '/troubleshooting/' },
      ],
    }),
  ],
  vite: {
    resolve: {
      dedupe: ['solid-js', 'solid-js/web', 'solid-js/store'],
    },
  },
});
