import React, { Component } from 'react';
import os from 'os';
import { Terminal } from 'xterm';
import * as fit from 'xterm/lib/addons/fit/fit';
import './Terminal.css';

const shell = os.platform() === 'win32' ? 'cmd.exe' : 'SHELL';
const pty = require('node-pty');

class TerminalView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      xTermInstance: {},
      virtualTerminalInstance: {},
    };
  }

  componentDidMount() {
    const ptyInstance = pty.spawn(shell, [], {
      name: 'xterm-color',
      cwd: process.cwd(),
      env: {},
    });

    Terminal.applyAddon(fit);
    const xTermInstance = new Terminal();
    xTermInstance.open(this.terminalInstanceDiv);
    xTermInstance.fit();
    xTermInstance.on('data', (data) => {
      ptyInstance.write(data);
    });
    ptyInstance.on('data', (data) => {
      xTermInstance.write(data);
    });

    ptyInstance.write('SET SOME=test\r');
    ptyInstance.write('cd ..\r');

    this.setState({ xTermInstance, virtualTerminalInstance: ptyInstance });
  }

  render() {
    return (
      <div
        id="xterm_dynamic_id_uuid"
        ref={(c) => {
          this.terminalInstanceDiv = c;
        }}
      />
    );
  }
}

export default TerminalView;
