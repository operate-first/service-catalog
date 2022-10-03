import React from 'react';
import { Grid } from '@material-ui/core';
import { EntityLinksCard, EntitySwitch } from '@backstage/plugin-catalog';
import Warning from './Warning';
import { hasLinks } from './utils';
import InfoCard from './InfoCard';

const OverviewWrapper = ({ children }: { children?: React.ReactNode }) => (
  <Grid container spacing={3} alignItems="flex-start">
    <Warning />
    <Grid item xs={12} md={9} container spacing={3} alignItems="stretch">
      {children}
    </Grid>
    <Grid item xs={12} md={3} container spacing={3} alignItems="stretch">
      <Grid item xs={12}>
        <InfoCard />
      </Grid>
      <Grid item xs={12}>
        <EntitySwitch>
          <EntitySwitch.Case if={hasLinks}>
            <EntityLinksCard cols={1} />
          </EntitySwitch.Case>
        </EntitySwitch>
      </Grid>
    </Grid>
  </Grid>
);

export default OverviewWrapper;
