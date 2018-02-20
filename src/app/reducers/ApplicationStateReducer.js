import ApplicationActionsTypes from '../actions/ApplicationActionTypes';

const initialState = {
  addNewTerminalWindowOpened: false,
  isLoading: false,
  loadingText: '',
};

export default function applicationState(state = initialState, action) {
  switch (action.type) {
    case ApplicationActionsTypes.ADD_TERMINAL_MODAL_WINDOW_OPEN:
      return { ...state, addNewTerminalWindowOpened: true };
    case ApplicationActionsTypes.ADD_TERMINAL_MODAL_WINDOW_CLOSE:
      return { ...state, addNewTerminalWindowOpened: false };
    case ApplicationActionsTypes.START_EXPORT_TERMINALS:
      return { ...state, isLoading: true, loadingText: 'Exporting terminals' };
    case ApplicationActionsTypes.ERROR_EXPORT_TERMINALS:
      return { ...state, isLoading: false };
    case ApplicationActionsTypes.SUCCESS_EXPORT_TERMINALS:
      return { ...state, isLoading: false };
    default:
      return state;
  }
}
