import TerminalActionTypes from './TerminalActionTypes';

const addNewTerminalInstance = terminalNewInstanceInfo => ({
  type: TerminalActionTypes.ADD_TERMINAL_INSTANCE,
  terminal: terminalNewInstanceInfo,
});

const editTerminalInstance = terminal => ({
  type: TerminalActionTypes.EDIT_TERMINAL_INSTANCE,
  terminal,
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

const moveRightTerminalInstance = terminalUUID => ({
  type: TerminalActionTypes.MOVE_RIGHT_TERMINAL_INSTANCE,
  terminalUUID,
});

const moveLeftTerminalInstance = terminalUUID => ({
  type: TerminalActionTypes.MOVE_LEFT_TERMINAL_INSTANCE,
  terminalUUID,
});

const stopTerminalInstance = terminalUUID => ({
  type: TerminalActionTypes.STOP_TERMINAL_INSTANCE,
  terminalUUID,
});

const goToNextTerminalInstance = () => ({
  type: TerminalActionTypes.GO_TO_NEXT_TERMINAL_INSTANCE,
});

const goToPreviousTerminalInstance = () => ({
  type: TerminalActionTypes.GO_TO_PREVIOUS_TERMINAL_INSTANCE,
});

export default {
  addNewTerminalInstance,
  editTerminalInstance,
  selectTerminalInstance,
  importTerminalInstances,
  reloadTerminalInstance,
  deleteTerminalInstance,
  moveRightTerminalInstance,
  moveLeftTerminalInstance,
  stopTerminalInstance,
  goToNextTerminalInstance,
  goToPreviousTerminalInstance,
};
