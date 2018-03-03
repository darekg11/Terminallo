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
    terminalType: singleTerminal.terminalType,
    name: singleTerminal.terminalName || 'Terminal',
    terminalStartupDir: singleTerminal.terminalStartupDir,
    terminalStartupCommands: singleTerminal.terminalStartupCommands || [],
  })),
});

const importTerminalsToObject = (jsonFile) => {
  if (!jsonFile || !jsonFile.terminals) {
    throw new Error('Selected file is not valid for terminals import');
  }
  return {
    terminals: jsonFile.terminals.map(singleTerminal => ({
      uuid: uuid.v4(),
      terminalType: singleTerminal.terminalType,
      terminalName: singleTerminal.name || 'Terminal',
      terminalStartupDir: singleTerminal.terminalStartupDir || '',
      terminalStartupCommands: singleTerminal.terminalStartupCommands || [],
    })),
  };
};

const killTerminalInstance = (terminalInstance) => {
  if (terminalInstance.xTermInstance) {
    terminalInstance.xTermInstance.destroy();
  }
  if (terminalInstance.virtualTerminalInstance) {
    terminalInstance.virtualTerminalInstance.kill();
  }
};

export { createNewTerminalInstance, exportTermninalsToObject, importTerminalsToObject, killTerminalInstance };
