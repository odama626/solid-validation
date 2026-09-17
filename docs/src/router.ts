import { createRouter } from '@solidjs/router';
import { fileRoutes } from '@solidjs/router/fs';
import { pageRoutes } from 'virtual:file-routes';

// Vite's base is the deploy prefix (/solid-validation/, later /v2/), so the
// router has to know it or every emitted href points at the domain root.
export const Router = createRouter({
  routes: fileRoutes(pageRoutes),
  base: import.meta.env.BASE_URL,
});
export const { paths } = Router;
