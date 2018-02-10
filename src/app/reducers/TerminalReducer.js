import * as uuid from 'uuid';
import { isUndefined } from 'lodash';
import TerminalActionTypes from '../actions/TerminalActionTypes';
import TerminalService from '../services/TerminalService';

const initialState = {
  terminals: [],
  selectedTerminal: '',
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
    case TerminalActionTypes.SELECT_TERMINAL_INSTANCE: {
      const destinationUUID = action.terminalUUID;
      let terminalInstance = state.terminals.find(singleTerminal => singleTerminal.uuid === destinationUUID);
      terminalInstance = isUndefined(terminalInstance) ? '' : terminalInstance.uuid;
      return { ...state, selectedTerminal: terminalInstance };
    }
    default:
      return state;
  }
}
