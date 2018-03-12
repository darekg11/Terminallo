import TerminalAddEditWindowActionTypes from './TerminalAddEditWindowActionTypes';

const showAddNewTerminalWindow = () => ({
  type: TerminalAddEditWindowActionTypes.ADD_NEW_TERMINAL_INSTANCE,
});

const showEditExistingTerminalWindow = terminal => ({
  type: TerminalAddEditWindowActionTypes.EDIT_EXISTING_TERMINAL_INSTANCE,
  terminal,
});

exports.showAddNewTerminalWindow = showAddNewTerminalWindow;
exports.showEditExistingTerminalWindow = showEditExistingTerminalWindow;
