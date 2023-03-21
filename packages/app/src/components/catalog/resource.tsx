import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { EntityLayout, EntitySwitch } from '@backstage/plugin-catalog';
import LayoutWrapper from './shared/LayoutWrapper';
import { hasLinks, isType } from './shared/utils';
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
  ClusterStatusCard,
} from '@janus-idp/backstage-plugin-ocm';
import LinkTiles from '../LinkTiles/LinkTiles';
import { RunBooksCard } from './shared/RunBooksCard';
import { WebTerminal } from '@internal/backstage-plugin-web-terminal';

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
        <EntitySwitch>
          <EntitySwitch.Case if={hasLinks}>
            <Grid item xs={12}>
              <Typography variant="h4" component="h2">
                Quick actions
              </Typography>
              <Typography variant="body1">
                Self service, quick access and links to learn more about this
                resource
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <LinkTiles />
            </Grid>
          </EntitySwitch.Case>
        </EntitySwitch>
      </OverviewWrapper>
    </EntityLayout.Route>

    <EntityLayout.Route if={isTechDocsAvailable} path="/docs" title="Docs">
      <EntityTechdocsContent />
    </EntityLayout.Route>
    <EntityLayout.Route path="/sre" title="SRE">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <RunBooksCard />
        </Grid>
        <Grid item xs={12}>
          <WebTerminal />
        </Grid>
      </Grid>
    </EntityLayout.Route>
  </LayoutWrapper>
);

export default resource;
