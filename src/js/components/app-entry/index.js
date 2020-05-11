import React from 'react';

import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';

import { HomePage } from 'src/js/components/home-page';

const theme = createMuiTheme({
  palette: {
    type: 'light',
    primary: green,
  },
});

const AppEntry = () => (
  <ThemeProvider theme={theme}>
    <HomePage />
  </ThemeProvider>
);

export {
  AppEntry
};
