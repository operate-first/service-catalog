import React from 'react';
import { Grid } from '@material-ui/core';
import { EntityHasSystemsCard, EntityLayout } from '@backstage/plugin-catalog';
import LayoutWrapper from './shared/LayoutWrapper';
import {
  Direction,
  EntityCatalogGraphCard,
} from '@backstage/plugin-catalog-graph';
import OverviewWrapper from './shared/OverviewWrapper';

const domain = (
  <LayoutWrapper>
    <EntityLayout.Route path="/" title="Overview">
      <OverviewWrapper>
        <Grid item xs={12}>
          <EntityCatalogGraphCard
            variant="gridItem"
            direction={Direction.LEFT_RIGHT}
            title="Domain Diagram"
            height={400}
          />
        </Grid>
        <Grid item xs={12}>
          <EntityHasSystemsCard variant="gridItem" />
        </Grid>
      </OverviewWrapper>
    </EntityLayout.Route>
  </LayoutWrapper>
);

export default domain;
