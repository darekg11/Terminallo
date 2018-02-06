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
      // newTerminalInstance.initialized = false;
      return { ...state, terminals: [...state.terminals, newTerminalInstance] };
    }
    case TerminalActionTypes.SELECT_TERMINAL_INSTANCE: {
      const destinationUUID = action.terminalUUID;
      let terminalInstance = state.terminals.find(singleTerminal => singleTerminal.uuid === destinationUUID);
      terminalInstance = isUndefined(terminalInstance) ? '' : terminalInstance.uuid;
      return { ...state, selectedTerminal: terminalInstance };
    }
    // case TerminalActionTypes.TERMINAL_DONE_INITIALIZATION: {
    //   const destinationUUID = action.terminalUUID;
    //   const terminalInstancesCopy = cloneDeep(state.terminals);
    //   const terminalInstance = terminalInstancesCopy.find(singleTerminal => singleTerminal.uuid === destinationUUID);
    //   if (!isUndefined(terminalInstance)) {
    //     terminalInstance.initialized = true;
    //   }
    //   return
    // }
    default:
      return state;
  }
}
