import React from 'react';
import { EntityLink } from '@backstage/catalog-model';
import { Link } from '@backstage/core-components';
import { useApp } from '@backstage/core-plugin-api';
import { BackstageTheme } from '@backstage/theme';
import { Box, createStyles, makeStyles, Typography } from '@material-ui/core';
import LanguageIcon from '@material-ui/icons/Language';
import ArrowRightIcon from '@material-ui/icons/ArrowForwardIos';

const useStyles = makeStyles((theme: BackstageTheme) =>
  createStyles({
    card: {
      border: `1px solid ${theme.palette.divider}`,
      boxShadow: theme.shadows[2],
      borderRadius: '4px',
      gap: '1em',
      padding: theme.spacing(2),
      color: '#fff',
      transition: `${theme.transitions.duration.standard}ms`,
      '&:hover': {
        boxShadow: theme.shadows[4],
      },
      background: theme.page.backgroundImage,
    },
    link: {
      '&:hover': {
        textDecoration: 'none',
      },
    },
  }),
);

const LinkTile = ({ url, title, icon }: EntityLink) => {
  const classes = useStyles();
  const app = useApp();

  const Icon = icon ? app.getSystemIcon(icon) ?? LanguageIcon : LanguageIcon;

  return (
    <Link to={url} variant="body2" className={classes.link}>
      <Box className={classes.card} display="flex" alignItems="center">
        <Icon />
        <Typography variant="h6">{title}</Typography>
        <ArrowRightIcon />
      </Box>
    </Link>
  );
};

export default LinkTile;
