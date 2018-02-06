import TerminalActionTypes from './TerminalActionTypes';

const addNewTerminalInstance = terminalNewInstanceInfo => ({
  type: TerminalActionTypes.ADD_TERMINAL_INSTANCE,
  terminal: terminalNewInstanceInfo,
});

const selectTerminalInstance = terminalUuid => ({
  type: TerminalActionTypes.SELECT_TERMINAL_INSTANCE,
  terminalUUID: terminalUuid,
});

// const terminalDoneInitialization = terminalUuid => ({
//   type: TerminalActionTypes.TERMINAL_DONE_INITIALIZATION,
//   terminalUUID: terminalUuid,
// });

exports.addNewTerminalInstance = addNewTerminalInstance;
exports.selectTerminalInstance = selectTerminalInstance;
// exports.terminalDoneInitialization = terminalDoneInitialization;
