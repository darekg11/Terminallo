import AddEditTerminalWindowActionTypes from '../actions/TerminalAddEditWindowActionTypes';

const initialState = {
  editMode: false,
  uuid: '',
  terminalType: '',
  terminalName: '',
  terminalStartupDir: '',
  terminalStartupCommands: [],
};

export default function addEditTerminalWindowState(state = initialState, action) {
  switch (action.type) {
    case AddEditTerminalWindowActionTypes.ADD_NEW_TERMINAL_INSTANCE:
      return initialState;
    case AddEditTerminalWindowActionTypes.EDIT_EXISTING_TERMINAL_INSTANCE: {
      return {
        editMode: true,
        uuid: action.terminal.uuid,
        terminalType: action.terminal.terminalType,
        terminalName: action.terminal.name,
        terminalStartupDir: action.terminal.terminalStartupDir,
        terminalStartupCommands: action.terminal.terminalStartupCommands,
      };
    }
    default:
      return state;
  }
}
