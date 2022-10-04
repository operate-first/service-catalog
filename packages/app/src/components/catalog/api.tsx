import React from 'react';
import { Grid } from '@material-ui/core';
import { EntityLayout } from '@backstage/plugin-catalog';
import LayoutWrapper from './shared/LayoutWrapper';
import {
  EntityApiDefinitionCard,
  EntityConsumingComponentsCard,
  EntityProvidingComponentsCard,
} from '@backstage/plugin-api-docs';
import OverviewWrapper from './shared/OverviewWrapper';

const api = (
  <LayoutWrapper>
    <EntityLayout.Route path="/" title="Overview">
      <OverviewWrapper>
        <Grid item xs={12}>
          <EntityProvidingComponentsCard />
        </Grid>
        <Grid item xs={12}>
          <EntityConsumingComponentsCard />
        </Grid>
        <Grid item xs={12}>
          <EntityApiDefinitionCard />
        </Grid>
      </OverviewWrapper>
    </EntityLayout.Route>
  </LayoutWrapper>
);

export default api;
