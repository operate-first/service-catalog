import { createPlugin, createRoutableExtension } from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const srePortalPlugin = createPlugin({
  id: 'sre-portal',
  routes: {
    root: rootRouteRef,
  },
});

export const SrePortalPage = srePortalPlugin.provide(
  createRoutableExtension({
    name: 'SrePortalPage',
    component: () =>
      import('./components/ExampleComponent').then(m => m.ExampleComponent),
    mountPoint: rootRouteRef,
  }),
);
