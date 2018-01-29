import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { createMuiTheme, lightBaseTheme } from 'material-ui/styles';
import Reboot from 'material-ui/Reboot';
import SidePanel from '../SidePanel/SidePanel';
import './MainWindow.css';

const theme = createMuiTheme({
  lightBaseTheme,
});

export default () => (
  <MuiThemeProvider theme={theme}>
    <Reboot>
      <SidePanel />
    </Reboot>
  </MuiThemeProvider>
);
