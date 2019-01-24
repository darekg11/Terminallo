import os from 'os';
import * as uuid from 'uuid';
import { Terminal } from 'xterm';
import * as fit from 'xterm/lib/addons/fit/fit';
import Mousetrap from 'mousetrap';
import TerminalTypes from '../enums/TerminalTypes';
import * as WatcherService from './WatcherService';

const commandLineEnding = os.platform() === 'win32' ? '\r\n' : '\n';
const terminalCreationWaitIntervalMs = 200;

const KEY_COMBINATIONS_THAT_SHOULD_BUBBLE_UP_FROM_TERMINAL = [
  'alt+p',
  'alt+r',
  'alt+d',
  'alt+right',
  'alt+left',
  'shift+left',
  'shift+right',
  'alt+s',
  'alt+e',
];

const MAPPING_TERM_KEYS_TO_MOUSETRAP = {
  ArrowRight: 'right',
  ArrowLeft: 'left',
};

const shouldEventBeProcessedByTerminal = (keyboardEvent) => {
  let keyboardSequence = '';
  if (keyboardEvent.altKey) {
    keyboardSequence += 'alt+';
  }
  if (keyboardEvent.shiftKey) {
    keyboardSequence += 'shift+';
  }
  keyboardSequence += MAPPING_TERM_KEYS_TO_MOUSETRAP[keyboardEvent.key] || keyboardEvent.key;
  if (KEY_COMBINATIONS_THAT_SHOULD_BUBBLE_UP_FROM_TERMINAL.includes(keyboardSequence)) {
    Mousetrap.trigger(keyboardSequence);
    return false;
  }
  return true;
};

const createNewTerminalInstance = (terminalData) => {
  const pty = require('node-pty');

  const osType = os.platform() === 'win32' ? 'windows' : 'unix';
  const terminalsForGivenOs = TerminalTypes[osType];
  const selectedTerminalType = terminalsForGivenOs[terminalData.terminalType];
  const shellStartCommand = selectedTerminalType.start;
  const virtualTerminalInstance = pty.spawn(shellStartCommand, [], {
    name: 'xterm-color',
    cwd: terminalData.terminalStartupDir,
    env: process.env,
  });

  Terminal.applyAddon(fit);
  const xTermInstance = new Terminal();
  xTermInstance.attachCustomKeyEventHandler(shouldEventBeProcessedByTerminal);
  xTermInstance.on('data', (data) => {
    virtualTerminalInstance.write(data);
  });
  virtualTerminalInstance.on('data', (data) => {
    xTermInstance.write(data);
  });
  setTimeout(() => {
    terminalData.terminalStartupCommands.forEach((singleCommand) => {
      virtualTerminalInstance.write(`${singleCommand}${commandLineEnding}`);
    });
  }, terminalCreationWaitIntervalMs);
  const terminalUuid = uuid.v4();
  WatcherService.addNewWatcher(terminalUuid, terminalData.terminalWatchers);
  return {
    uuid: terminalUuid,
    xTermInstance,
    virtualTerminalInstance,
  };
};

const exportTermninalsToObject = terminalInstances => ({
  terminals: terminalInstances.map(singleTerminal => ({
    terminalWatchers: singleTerminal.terminalWatchers || [],
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
      terminalWatchers: singleTerminal.terminalWatchers || [],
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
  WatcherService.removeWatcher(terminalInstance.uuid);
};

export {
  createNewTerminalInstance, exportTermninalsToObject, importTerminalsToObject, killTerminalInstance,
};
