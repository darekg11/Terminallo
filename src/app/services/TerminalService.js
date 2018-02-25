import os from 'os';
import * as uuid from 'uuid';
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

const exportTermninalsToObject = terminalInstances => ({
  terminals: terminalInstances.map(singleTerminal => ({
    uuid: singleTerminal.uuid || uuid.v4(),
    terminalType: singleTerminal.terminalType,
    name: singleTerminal.terminalName || 'Terminal',
    terminalStartupDir: singleTerminal.terminalStartupDir,
    terminalStartupCommands: singleTerminal.terminalStartupCommands || [],
  })),
});

const importTerminalsToObject = jsonFile => ({
  terminals: jsonFile.terminal.map(singleTerminal => ({
    uuid: singleTerminal.uuid || uuid.v4(),
    terminalType: singleTerminal.terminalType,
    terminalName: singleTerminal.terminalName || 'Terminal',
    terminalStartupDir: singleTerminal.terminalStartupDir || '',
    terminalStartupCommands: singleTerminal.terminalStartupCommands || [],
  })),
});

export { createNewTerminalInstance, exportTermninalsToObject, importTerminalsToObject };
