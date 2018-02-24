import ApplicationActionsTypes from '../actions/ApplicationActionTypes';

const initialState = {
  addNewTerminalWindowOpened: false,
};

export default function applicationState(state = initialState, action) {
  switch (action.type) {
    case ApplicationActionsTypes.ADD_TERMINAL_MODAL_WINDOW_OPEN:
      return { ...state, addNewTerminalWindowOpened: true };
    case ApplicationActionsTypes.ADD_TERMINAL_MODAL_WINDOW_CLOSE:
      return { ...state, addNewTerminalWindowOpened: false };
    default:
      return state;
  }
}
