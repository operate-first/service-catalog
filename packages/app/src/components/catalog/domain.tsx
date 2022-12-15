import React from 'react';
import { Grid } from '@material-ui/core';
import {
  EntityHasSystemsCard,
  EntityLayout,
  EntitySwitch,
} from '@backstage/plugin-catalog';
import LayoutWrapper from './shared/LayoutWrapper';
import {
  Direction,
  EntityCatalogGraphCard,
} from '@backstage/plugin-catalog-graph';
import OverviewWrapper from './shared/OverviewWrapper';
import { adrFilePathFilter, hasLinks } from './shared/utils';
import LinkTiles from '../LinkTiles/LinkTiles';
import {
  EntityTechdocsContent,
  isTechDocsAvailable,
} from '@backstage/plugin-techdocs';
import { EntityAdrContent, isAdrAvailable } from '@backstage/plugin-adr';

const domain = (
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
            title="Domain Diagram"
            height={400}
          />
        </Grid>
        <Grid item xs={12}>
          <EntityHasSystemsCard variant="gridItem" />
        </Grid>
      </OverviewWrapper>
    </EntityLayout.Route>
    <EntityLayout.Route path="/docs" if={isTechDocsAvailable} title="Docs">
      <EntityTechdocsContent />
    </EntityLayout.Route>
    <EntityLayout.Route if={isAdrAvailable} path="/adrs" title="ADRs">
      <EntityAdrContent filePathFilterFn={adrFilePathFilter} />
    </EntityLayout.Route>
  </LayoutWrapper>
);

export default domain;
