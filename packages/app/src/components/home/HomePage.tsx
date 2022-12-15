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
import { HomePageCompanyLogo } from '@backstage/plugin-home';
import { HomePageSearchBar } from '@backstage/plugin-search';
import {
  Chip,
  CircularProgress,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';
import FilterListIcon from '@material-ui/icons/FilterList';

import {
  catalogApiRef,
  CATALOG_FILTER_EXISTS,
  EntityRefLink,
} from '@backstage/plugin-catalog-react';
import useAsyncFn from 'react-use/lib/useAsyncFn';
import useDebounce from 'react-use/lib/useDebounce';
import { useApi } from '@backstage/core-plugin-api';
import { Entity } from '@backstage/catalog-model';
import Logo from '../Logo/Logo';
import { ICON_ANNOTATION, FEATURED_ANNOTATION } from '../../constants';

const useStyles = makeStyles(theme => ({
  searchBar: {
    display: 'flex',
    maxWidth: '60vw',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[1],
    padding: '8px 12px',
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
    height: 150,
  },
}));

const useCatalogStyles = makeStyles({
  root: {
    height: '100%',
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
      objectFit: 'contain',
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

const CatalogCards = () => {
  const catalogApi = useApi(catalogApiRef);
  const classes = useCatalogStyles();
  const [entities, setEntities] = useState<Entity[]>([]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [{ loading, error }, refresh] = useAsyncFn(
    async () => {
      const response = await catalogApi.getEntities({
        filter: {
          [`metadata.annotations.${ICON_ANNOTATION}`]: CATALOG_FILTER_EXISTS,
          [`metadata.annotations.${FEATURED_ANNOTATION}`]: 'true',
        },
      });
      setEntities(response.items);
    },
    [catalogApi],
    { loading: true },
  );
  useDebounce(refresh, 10);
  const allFilters = Array.from(
    new Set(entities.map(e => e?.spec?.domain as string)),
  );

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

  const handleFilterToggle = (value: string) => () => {
    if (activeFilters.includes(value)) {
      setActiveFilters([...activeFilters.filter(f => f !== value)]);
    } else {
      setActiveFilters([...activeFilters, value]);
    }
  };

  return (
    <>
      <FilterListIcon />{' '}
      {allFilters.map(f => (
        <Chip
          label={f}
          variant={activeFilters.includes(f) ? 'default' : 'outlined'}
          onClick={handleFilterToggle(f)}
        />
      ))}
      <Grid container justifyContent="center">
        {entities
          .filter(
            e =>
              activeFilters.length === 0 ||
              activeFilters.includes(e?.spec?.domain as string),
          )
          .map(e => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              xl={2}
              key={e.metadata.name}
            >
              <EntityRefLink entityRef={e} className={classes.link}>
                <InfoCard
                  className={classes.root}
                  title={
                    e.metadata.annotations?.[ICON_ANNOTATION] ? (
                      <img
                        src={e.metadata.annotations[ICON_ANNOTATION]}
                        alt={`${e.metadata.title || e.metadata.name} logo`}
                      />
                    ) : (
                      <HelpIcon />
                    )
                  }
                  subheader={
                    <div className={classes.subheader}>
                      {e.metadata.title || e.metadata.name}
                    </div>
                  }
                >
                  <Typography paragraph>{e.metadata.description}</Typography>
                </InfoCard>
              </EntityRefLink>
            </Grid>
          ))}
      </Grid>
    </>
  );
};
export const HomePage = () => {
  const classes = useStyles();
  const { svg, container } = useLogoStyles();

  return (
    <SearchContextProvider>
      <Page themeId="home">
        <Content>
          <Grid container justifyContent="center" spacing={6}>
            <HomePageCompanyLogo
              className={container}
              logo={<Logo classes={{ svg }} />}
            />
            <Grid container item xs={12} alignItems="center" direction="row">
              <HomePageSearchBar
                classes={{ root: classes.searchBar }}
                placeholder="Search"
              />
            </Grid>
            <Grid item xs={12}>
              <CatalogCards />
            </Grid>
          </Grid>
        </Content>
      </Page>
    </SearchContextProvider>
  );
};
