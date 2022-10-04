import React from 'react';
import { Grid } from '@material-ui/core';
import {
  EntityHasComponentsCard,
  EntityHasResourcesCard,
  EntityLayout,
} from '@backstage/plugin-catalog';
import {
  Direction,
  EntityCatalogGraphCard,
} from '@backstage/plugin-catalog-graph';
import { EntityHasApisCard } from '@backstage/plugin-api-docs';

import LayoutWrapper from './shared/LayoutWrapper';
import OverviewWrapper from './shared/OverviewWrapper';

const system = (
  <LayoutWrapper>
    <EntityLayout.Route path="/" title="Overview">
      <OverviewWrapper>
        <Grid item xs={12}>
          <EntityCatalogGraphCard
            variant="gridItem"
            direction={Direction.LEFT_RIGHT}
            title="System Diagram"
            height={400}
          />
        </Grid>
        <Grid item xs={12}>
          <EntityHasComponentsCard variant="gridItem" />
        </Grid>
        <Grid item xs={12}>
          <EntityHasApisCard variant="gridItem" />
        </Grid>
        <Grid item xs={12}>
          <EntityHasResourcesCard variant="gridItem" />
        </Grid>
      </OverviewWrapper>
    </EntityLayout.Route>
  </LayoutWrapper>
);

export default system;
