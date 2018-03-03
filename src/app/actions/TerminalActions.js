import TerminalActionTypes from './TerminalActionTypes';

const addNewTerminalInstance = terminalNewInstanceInfo => ({
  type: TerminalActionTypes.ADD_TERMINAL_INSTANCE,
  terminal: terminalNewInstanceInfo,
});

const selectTerminalInstance = terminalUuid => ({
  type: TerminalActionTypes.SELECT_TERMINAL_INSTANCE,
  terminalUUID: terminalUuid,
});

const importTerminalInstances = terminalInstances => ({
  type: TerminalActionTypes.IMPORT_TERMINALS,
  terminals: terminalInstances,
});

const reloadTerminalInstance = terminalUUID => ({
  type: TerminalActionTypes.RELOAD_TERMINAL_INSTANCE,
  terminalUUID,
});

const deleteTerminalInstance = terminalUUID => ({
  type: TerminalActionTypes.DELETE_TERMINAL_INSTANCE,
  terminalUUID,
});

exports.addNewTerminalInstance = addNewTerminalInstance;
exports.selectTerminalInstance = selectTerminalInstance;
exports.importTerminalInstances = importTerminalInstances;
exports.reloadTerminalInstance = reloadTerminalInstance;
exports.deleteTerminalInstance = deleteTerminalInstance;
