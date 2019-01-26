import os from 'os';
import * as uuid from 'uuid';
import { isUndefined } from 'lodash';
import { Terminal } from 'xterm';
import * as fit from 'xterm/lib/addons/fit/fit';
import Mousetrap from 'mousetrap';
import TerminalTypes from '../enums/TerminalTypes';
import * as WatcherService from './WatcherService';

const commandLineEnding = os.platform() === 'win32' ? '\r\n' : '\n';
const terminalCreationWaitIntervalMs = 200;

let terminals = [];

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
  const terminalId = `terminal-${terminalUuid}`;
  WatcherService.addNewWatcher(terminalId, terminalData.terminalWatchers);
  terminals.push({ id: terminalId, xTermInstance, virtualTerminalInstance });
  return terminalId;
};

const resizeTerminal = (terminalId) => {
  const terminal = terminals.find(singleTerminal => singleTerminal.id === terminalId);
  if (isUndefined(terminal)) {
    return;
  }

  const { xTermInstance, virtualTerminalInstance } = terminal;
  const resizedDimensions = xTermInstance.proposeGeometry();
  xTermInstance.fit();
  virtualTerminalInstance.resize(resizedDimensions.cols, resizedDimensions.rows);
};

const hookTerminalToRenderer = (terminalId, renderedElement) => {
  const terminal = terminals.find(singleTerminal => singleTerminal.id === terminalId);
  if (isUndefined(terminal)) {
    return;
  }

  const { xTermInstance } = terminal;
  xTermInstance.open(renderedElement);
  resizeTerminal(terminalId);
};

const killTerminalInstance = (terminalId) => {
  const terminal = terminals.find(singleTerminal => singleTerminal.id === terminalId);
  if (isUndefined(terminal)) {
    return;
  }

  if (terminal.xTermInstance) {
    terminal.xTermInstance.destroy();
  }
  if (terminal.virtualTerminalInstance) {
    terminal.virtualTerminalInstance.kill();
  }
  WatcherService.removeWatcher(terminalId);
  terminals = terminals.filter(singleTerminal => singleTerminal.id !== terminalId);
};

const killAllTerminalInstances = () => {
  while (terminals.length > 0) {
    const terminalToKill = terminals[0];
    killTerminalInstance(terminalToKill.id);
  }
};

const stopTerminalInstance = (terminalId) => {
  const terminal = terminals.find(singleTerminal => singleTerminal.id === terminalId);
  if (isUndefined(terminal)) {
    return;
  }

  terminal.virtualTerminalInstance.write('\x03');
};

const reloadTerminalInstance = (terminalId, terminalInstanceData) => {
  killTerminalInstance(terminalId);
  return createNewTerminalInstance(terminalInstanceData);
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
      terminalWatchers: singleTerminal.terminalWatchers || [],
      terminalType: singleTerminal.terminalType,
      terminalName: singleTerminal.name || 'Terminal',
      terminalStartupDir: singleTerminal.terminalStartupDir || '',
      terminalStartupCommands: singleTerminal.terminalStartupCommands || [],
    })),
  };
};

export {
  createNewTerminalInstance,
  exportTermninalsToObject,
  hookTerminalToRenderer,
  importTerminalsToObject,
  killAllTerminalInstances,
  killTerminalInstance,
  reloadTerminalInstance,
  resizeTerminal,
  stopTerminalInstance,
};
