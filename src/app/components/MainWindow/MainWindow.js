import React from 'react';
import Reboot from 'material-ui/Reboot';
import TerminalView from './../Terminal/Terminal';
import './MainWindow.css';

export default () => (
  <div>
    <Reboot>
      <TerminalView />
    </Reboot>
  </div>
);
