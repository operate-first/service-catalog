import React, { useState } from 'react';
import { SearchContextProvider } from '@backstage/plugin-search-react';
import {
  Content,
  Page,
  InfoCard,
  WarningPanel,
  CodeSnippet,
  HelpIcon,
} from '@backstage/core-components';
import {
  HomePageCompanyLogo,
  TemplateBackstageLogo,
} from '@backstage/plugin-home';
import { HomePageSearchBar } from '@backstage/plugin-search';
import {
  CircularProgress,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';

import { catalogApiRef, EntityRefLink } from '@backstage/plugin-catalog-react';
import useAsyncFn from 'react-use/lib/useAsyncFn';
import useDebounce from 'react-use/lib/useDebounce';
import { useApi } from '@backstage/core-plugin-api';
import { Entity } from '@backstage/catalog-model';

const useStyles = makeStyles(theme => ({
  searchBar: {
    display: 'flex',
    maxWidth: '60vw',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[1],
    padding: '8px 0',
    borderRadius: '50px',
    margin: 'auto',
  },
}));

const useLogoStyles = makeStyles(theme => ({
  container: {
    margin: theme.spacing(5, 0),
  },
  svg: {
    width: 'auto',
    height: 100,
  },
  path: {
    fill: '#7df3e1',
  },
}));

const useCatalogStyles = makeStyles({
  root: {
    transition: 'all .25s linear',
    textAlign: 'center',
    '&:hover': {
      boxShadow: '0px 0px 16px 0px rgba(0,0,0,0.8)',
    },
    '& svg': {
      fontSize: 80,
    },
    '& img': {
      height: 80,
      width: 80,
    },
  },
  subheader: {
    display: 'block',
    width: '100%',
  },
  link: {
    '&:hover': {
      textDecoration: 'none',
    },
  },
});
const ICON_ANNOTATION = 'operate-first.cloud/component-icon-url';

const CatalogCards = () => {
  const catalogApi = useApi(catalogApiRef);
  const classes = useCatalogStyles();
  const [entities, setEntities] = useState<Entity[]>([]);
  const [{ loading, error }, refresh] = useAsyncFn(
    async () => {
      const response = await catalogApi.getEntities();
      setEntities(response.items.filter(e => e.kind === 'Component'));
    },
    [catalogApi],
    { loading: true },
  );
  useDebounce(refresh, 10);

  if (error) {
    return (
      <WarningPanel severity="error" title="Could not fetch catalog entities.">
        <CodeSnippet language="text" text={error.toString()} />
      </WarningPanel>
    );
  }

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <>
      {entities.map(e => (
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={e.metadata.name}>
          <EntityRefLink entityRef={e} className={classes.link}>
            <InfoCard
              className={classes.root}
              title={
                e.metadata.annotations?.[ICON_ANNOTATION] ? (
                  <img
                    src={e.metadata.annotations[ICON_ANNOTATION]}
                    alt={`${e.metadata.name} logo`}
                  />
                ) : (
                  <HelpIcon />
                )
              }
              subheader={
                <div className={classes.subheader}>{e.metadata.name}</div>
              }
            >
              <Typography paragraph>{e.metadata.description}</Typography>
            </InfoCard>
          </EntityRefLink>
        </Grid>
      ))}
    </>
  );
};
export const HomePage = () => {
  const classes = useStyles();
  const { svg, path, container } = useLogoStyles();

  return (
    <SearchContextProvider>
      <Page themeId="home">
        <Content>
          <Grid container justifyContent="center" spacing={6}>
            <HomePageCompanyLogo
              className={container}
              logo={<TemplateBackstageLogo classes={{ svg, path }} />}
            />
            <Grid container item xs={12} alignItems="center" direction="row">
              <HomePageSearchBar
                classes={{ root: classes.searchBar }}
                placeholder="Search"
              />
            </Grid>
            <Grid container item xs={12} justifyContent="center">
              <CatalogCards />
            </Grid>
          </Grid>
        </Content>
      </Page>
    </SearchContextProvider>
  );
};
