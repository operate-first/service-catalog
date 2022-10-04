import React from 'react';
import { Grid } from '@material-ui/core';
import {
  EntitySwitch,
  EntityOrphanWarning,
  EntityProcessingErrorsPanel,
  hasCatalogProcessingErrors,
  isOrphan,
} from '@backstage/plugin-catalog';

const Warning = () => (
  <>
    <EntitySwitch>
      <EntitySwitch.Case if={isOrphan}>
        <Grid item xs={12}>
          <EntityOrphanWarning />
        </Grid>
      </EntitySwitch.Case>
    </EntitySwitch>
    <EntitySwitch>
      <EntitySwitch.Case if={hasCatalogProcessingErrors}>
        <Grid item xs={12}>
          <EntityProcessingErrorsPanel />
        </Grid>
      </EntitySwitch.Case>
    </EntitySwitch>
  </>
);

export default Warning;
