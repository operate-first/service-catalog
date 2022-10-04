import React from 'react';
import { Grid } from '@material-ui/core';
import { EntityLayout } from '@backstage/plugin-catalog';
import {
  EntityUserProfileCard,
  EntityOwnershipCard,
} from '@backstage/plugin-org';
import Warning from './shared/Warning';
import LayoutWrapper from './shared/LayoutWrapper';

const user = (
  <LayoutWrapper>
    <EntityLayout.Route path="/" title="Overview">
      <Grid container spacing={3}>
        <Warning />
        <Grid item xs={12} md={4}>
          <EntityUserProfileCard variant="gridItem" />
        </Grid>
        <Grid item xs={12} md={8}>
          <EntityOwnershipCard hideRelationsToggle variant="gridItem" />
        </Grid>
      </Grid>
    </EntityLayout.Route>
  </LayoutWrapper>
);

export default user;
