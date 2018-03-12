import ApplicationActionsTypes from '../actions/ApplicationActionTypes';

const initialState = {
  terminalsFilePath: '',
};

export default function applicationState(state = initialState, action) {
  switch (action.type) {
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
