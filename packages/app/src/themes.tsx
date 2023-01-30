import {
  BackstageTheme,
  createTheme,
  darkTheme,
  genPageTheme,
  lightTheme,
  shapes,
} from '@backstage/theme';

import React from 'react';
import DarkIcon from '@material-ui/icons/Brightness2';
import LightIcon from '@material-ui/icons/WbSunny';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { AppTheme } from '@backstage/core-plugin-api';

const sharedColors = {
  palette: {
    error: {
      main: '#8c4351',
    },
    warning: {
      main: '#8f5e15',
    },
    info: {
      main: '#34548a',
    },
    success: {
      main: '#485e30',
    },
    banner: {
      info: '#34548a',
      error: '#8c4351',
      text: '#343b58',
      link: '#565a6e',
    },
    errorBackground: '#8c4351',
    warningBackground: '#8f5e15',
    infoBackground: '#343b58',
    navigation: {
      background: '#000',
      indicator: '#ffcc00',
      color: '#ccc',
      selectedColor: '#fff',
    },
  },
  defaultPageTheme: 'home',
  /* below drives the header colors */
  pageTheme: {
    home: genPageTheme({ colors: ['#ffcc00', '#c19a00'], shape: shapes.wave }),
    operator: genPageTheme({ colors: ['#000', '#333'], shape: shapes.round }),
    documentation: genPageTheme({
      colors: ['#8c4351', '#343b58'],
      shape: shapes.wave2,
    }),
    service: genPageTheme({
      colors: ['#8c4351', '#343b58'],
      shape: shapes.wave,
    }),
    website: genPageTheme({
      colors: ['#8c4351', '#343b58'],
      shape: shapes.wave,
    }),
    library: genPageTheme({
      colors: ['#8c4351', '#343b58'],
      shape: shapes.wave,
    }),
    other: genPageTheme({ colors: ['#8c4351', '#343b58'], shape: shapes.wave }),
    app: genPageTheme({ colors: ['#8c4351', '#343b58'], shape: shapes.wave }),
    apis: genPageTheme({ colors: ['#8c4351', '#343b58'], shape: shapes.wave }),
  },
};

const operateFirstTheme = createTheme({
  ...sharedColors,
  palette: {
    ...lightTheme.palette,
    ...sharedColors.palette,
  },
});

const operateFirstDarkTheme = createTheme({
  ...sharedColors,
  palette: {
    ...darkTheme.palette,
    ...sharedColors.palette,
    background: {
      default: '#1e1e1e',
    },
  },
});

const providerFactory =
  (theme: BackstageTheme) =>
  ({ children }: React.PropsWithChildren<{}>) =>
    (
      <ThemeProvider theme={theme}>
        <CssBaseline>{children}</CssBaseline>
      </ThemeProvider>
    );

export const themes: AppTheme[] = [
  {
    id: 'light',
    title: 'Light Theme',
    variant: 'light',
    icon: <LightIcon />,
    Provider: providerFactory(operateFirstTheme),
  },
  {
    id: 'dark',
    title: 'Dark Theme',
    variant: 'dark',
    icon: <DarkIcon />,
    Provider: providerFactory(operateFirstDarkTheme),
  },
];
