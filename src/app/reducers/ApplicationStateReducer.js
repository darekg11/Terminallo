import ApplicationActionsTypes from '../actions/ApplicationActionTypes';

const initialState = {
  addNewTerminalWindowOpened: false,
  terminalsFilePath: '',
};

export default function applicationState(state = initialState, action) {
  switch (action.type) {
    case ApplicationActionsTypes.ADD_TERMINAL_MODAL_WINDOW_OPEN:
      return { ...state, addNewTerminalWindowOpened: true };
    case ApplicationActionsTypes.ADD_TERMINAL_MODAL_WINDOW_CLOSE:
      return { ...state, addNewTerminalWindowOpened: false };
    case ApplicationActionsTypes.SET_TERMINALS_SOURCE_FILE_PATH: {
      if (action.path) {
        return { ...state, terminalsFilePath: action.path };
      }
      return state;
    }
    default:
      return state;
  }
}
