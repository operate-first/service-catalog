import { HorizontalScrollGrid } from '@backstage/core-components';
import { useEntity } from '@backstage/plugin-catalog-react';
import { Grid } from '@material-ui/core';
import React from 'react';
import LinkTile from './LinkTile';

const LinkTiles = () => {
  const { entity } = useEntity();

  if (!entity.metadata.links) {
    return null;
  }

  return (
    <HorizontalScrollGrid>
      {entity.metadata.links.map(l => (
        <Grid item>
          <LinkTile {...l} />
        </Grid>
      ))}
    </HorizontalScrollGrid>
  );
};

export default LinkTiles;
