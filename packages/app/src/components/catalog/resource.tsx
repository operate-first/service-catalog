import React from 'react';
import { Grid } from '@material-ui/core';
import { EntityLayout, EntitySwitch } from '@backstage/plugin-catalog';
import LayoutWrapper from './shared/LayoutWrapper';
import { isType } from './shared/utils';
import {
  EntityTechdocsContent,
  isTechDocsAvailable,
} from '@backstage/plugin-techdocs';
import OverviewWrapper from './shared/OverviewWrapper';
import {
  ClusterAllocatableResourceCard,
  ClusterAvailableResourceCard,
  ClusterInfoCard,
  ClusterContextProvider,
  ClusterStatusCard
} from '@internal/backstage-plugin-rhacm';

const resource = (
  <LayoutWrapper>
    <EntityLayout.Route path="/" title="Overview">
      <OverviewWrapper>
        <Grid item xs={12}>
          <EntitySwitch>
            <EntitySwitch.Case if={isType('kubernetes-cluster')}>
              <ClusterContextProvider>
                <Grid container>
                  <Grid container item direction="column" xs={3}>
                    <Grid item>
                      <ClusterStatusCard />
                    </Grid>
                    <Grid item>
                      <ClusterAllocatableResourceCard />
                    </Grid>
                    <Grid item>
                      <ClusterAvailableResourceCard />
                    </Grid>
                  </Grid>
                  <Grid item xs>
                    <ClusterInfoCard />
                  </Grid>
                </Grid>
              </ClusterContextProvider>
            </EntitySwitch.Case>
          </EntitySwitch>
        </Grid>
      </OverviewWrapper>
    </EntityLayout.Route>

    <EntityLayout.Route if={isTechDocsAvailable} path="/docs" title="Docs">
      <EntityTechdocsContent />
    </EntityLayout.Route>
  </LayoutWrapper>
);

export default resource;
