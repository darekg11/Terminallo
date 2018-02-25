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

exports.addNewTerminalInstance = addNewTerminalInstance;
exports.selectTerminalInstance = selectTerminalInstance;
exports.importTerminalInstances = importTerminalInstances;
