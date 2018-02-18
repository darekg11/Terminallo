import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { createMuiTheme, lightBaseTheme } from 'material-ui/styles';
import Reboot from 'material-ui/Reboot';
import MainPanel from '../MainPanel/MainPanel';
import SidePanel from '../SidePanel/SidePanel';
import AppBarMain from '../AppBarMain/AppBarMain';
import TerminalTabs from '../TerminalTabs/TerminalTabs';
import AddNewTerminalModalWindow from '../AddTerminalWindow/AddTerminalWindow';
import './MainWindow.css';

const theme = createMuiTheme({
  lightBaseTheme,
});

export default () => (
  <MuiThemeProvider theme={theme}>
    <Reboot>
      <div className="App">
        <SidePanel />
        <MainPanel>
          <AppBarMain />
          <TerminalTabs />
        </MainPanel>
        <AddNewTerminalModalWindow />
      </div>
    </Reboot>
  </MuiThemeProvider>
);
