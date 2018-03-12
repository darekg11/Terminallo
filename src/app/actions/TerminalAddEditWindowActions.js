import TerminalAddEditWindowActionTypes from './TerminalAddEditWindowActionTypes';

const showAddNewTerminalWindow = () => ({
  type: TerminalAddEditWindowActionTypes.ADD_NEW_TERMINAL_INSTANCE,
});

const showEditExistingTerminalWindow = terminal => ({
  type: TerminalAddEditWindowActionTypes.EDIT_EXISTING_TERMINAL_INSTANCE,
  terminal,
});

const closeAddEditTerminalWindow = () => ({
  type: TerminalAddEditWindowActionTypes.ADD_EDIT_TERMINAL_MODAL_WINDOW_CLOSE,
});

exports.showAddNewTerminalWindow = showAddNewTerminalWindow;
exports.showEditExistingTerminalWindow = showEditExistingTerminalWindow;
exports.closeAddEditTerminalWindow = closeAddEditTerminalWindow;
