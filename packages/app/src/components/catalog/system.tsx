import React from 'react';
import { Grid } from '@material-ui/core';
import {
  EntityHasComponentsCard,
  EntityHasResourcesCard,
  EntityLayout,
  EntitySwitch,
} from '@backstage/plugin-catalog';
import {
  Direction,
  EntityCatalogGraphCard,
} from '@backstage/plugin-catalog-graph';
import { EntityHasApisCard } from '@backstage/plugin-api-docs';

import LayoutWrapper from './shared/LayoutWrapper';
import OverviewWrapper from './shared/OverviewWrapper';
import { EntityKubernetesContent, isKubernetesAvailable } from '@backstage/plugin-kubernetes';
import { EntityArgoCDOverviewCard, isArgocdAvailable } from '@roadiehq/backstage-plugin-argo-cd';
import { hasLinks } from './shared/utils';
import LinkTiles from '../LinkTiles/LinkTiles';

const system = (
  <LayoutWrapper>
    <EntityLayout.Route path="/" title="Overview">
      <OverviewWrapper>
        <EntitySwitch>
          <EntitySwitch.Case if={hasLinks}>
            <Grid item xs={12}>
              <LinkTiles />
            </Grid>
          </EntitySwitch.Case>
        </EntitySwitch>
        <Grid item xs={12}>
          <EntityCatalogGraphCard
            variant="gridItem"
            direction={Direction.LEFT_RIGHT}
            title="System Diagram"
            height={400}
          />
        </Grid>
        <EntitySwitch>
          <EntitySwitch.Case if={isArgocdAvailable}>
            <Grid item xs={12}>
              <EntityArgoCDOverviewCard />
            </Grid>
          </EntitySwitch.Case>
        </EntitySwitch>
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
    <EntityLayout.Route if={isKubernetesAvailable} path="/kubernetes" title="Openshift">
      <EntityKubernetesContent refreshIntervalMs={30000} />
    </EntityLayout.Route>
  </LayoutWrapper>
);

export default system;
