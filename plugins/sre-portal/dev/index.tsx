import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { srePortalPlugin, SrePortalPage } from '../src/plugin';

createDevApp()
  .registerPlugin(srePortalPlugin)
  .addPage({
    element: <SrePortalPage />,
    title: 'Root Page',
    path: '/sre-portal'
  })
  .render();
