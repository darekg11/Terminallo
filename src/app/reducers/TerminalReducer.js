import * as uuid from 'uuid';
import TerminalActionTypes from '../actions/TerminalActionTypes';
import TerminalService from '../services/TerminalService';

const initialState = {
  terminals: [],
};

export default function terminalReducer(state = initialState, action) {
  switch (action.type) {
    case TerminalActionTypes.ADD_TERMINAL_INSTANCE: {
      const createdTerminalInstance = TerminalService.createNewTerminalInstance(action.terminal);
      const newTerminalInstance = action.terminal;
      newTerminalInstance.uuid = uuid.v4();
      newTerminalInstance.xTermInstance = createdTerminalInstance.xTermInstance;
      newTerminalInstance.virtualTerminalInstance = createdTerminalInstance.virtualTerminalInstance;
      return { ...state, terminals: [...state.terminals, newTerminalInstance] };
    }
    default:
      return state;
  }
}
