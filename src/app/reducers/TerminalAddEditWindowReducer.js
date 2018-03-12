import AddEditTerminalWindowActionTypes from '../actions/TerminalAddEditWindowActionTypes';

const initialState = {
  windowOpened: false,
  editMode: false,
  uuid: '',
  terminalType: '',
  terminalName: '',
  terminalStartupDir: '',
  terminalStartupCommands: [],
};

export default function addEditTerminalWindowState(state = initialState, action) {
  switch (action.type) {
    case AddEditTerminalWindowActionTypes.ADD_NEW_TERMINAL_INSTANCE: {
      return { ...initialState, windowOpened: true };
    }
    case AddEditTerminalWindowActionTypes.EDIT_EXISTING_TERMINAL_INSTANCE: {
      return {
        windowOpened: true,
        editMode: true,
        uuid: action.terminal.uuid,
        terminalType: action.terminal.terminalType,
        terminalName: action.terminal.terminalName,
        terminalStartupDir: action.terminal.terminalStartupDir,
        terminalStartupCommands: action.terminal.terminalStartupCommands,
      };
    }
    case AddEditTerminalWindowActionTypes.ADD_EDIT_TERMINAL_MODAL_WINDOW_CLOSE: {
      return initialState;
    }
    default:
      return state;
  }
}
