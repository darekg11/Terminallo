import os from 'os';
import { Terminal } from 'xterm';
import * as fit from 'xterm/lib/addons/fit/fit';
import TerminalTypes from '../enums/TerminalTypes';

const createNewTerminalInstance = (terminalData) => {
  const pty = require('node-pty');

  const osType = os.platform() === 'win32' ? 'windows' : 'unix';
  const terminalsForGivenOs = TerminalTypes[osType];
  const selectedTerminalType = terminalsForGivenOs[terminalData.terminalType];
  const shellStartCommand = selectedTerminalType.start;
  const virtualTerminalInstance = pty.spawn(shellStartCommand, [], {
    name: 'xterm-color',
    cwd: terminalData.terminalStartupDir,
    env: {},
  });

  Terminal.applyAddon(fit);
  const xTermInstance = new Terminal();
  xTermInstance.on('data', (data) => {
    virtualTerminalInstance.write(data);
  });
  virtualTerminalInstance.on('data', (data) => {
    xTermInstance.write(data);
  });
  terminalData.terminalStartupCommands.forEach((singleCommand) => {
    virtualTerminalInstance.write(`${singleCommand}\r`);
  });
  return {
    xTermInstance,
    virtualTerminalInstance,
  };
};

export { createNewTerminalInstance };
