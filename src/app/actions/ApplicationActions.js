import ApplicationActionTypes from './ApplicationActionTypes';

const openAddNewTerminalModalWindow = () => ({
  type: ApplicationActionTypes.ADD_TERMINAL_MODAL_WINDOW_OPEN,
});

const closeAddNewTerminalModalWindow = () => ({
  type: ApplicationActionTypes.ADD_TERMINAL_MODAL_WINDOW_CLOSE,
});

exports.openAddNewTerminalModalWindow = openAddNewTerminalModalWindow;
exports.closeAddNewTerminalModalWindow = closeAddNewTerminalModalWindow;
