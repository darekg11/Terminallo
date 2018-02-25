import * as uuid from 'uuid';
import { isUndefined } from 'lodash';
import TerminalActionTypes from '../actions/TerminalActionTypes';
import * as TerminalService from '../services/TerminalService';

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
      return {
        ...state,
        terminals: [...state.terminals, newTerminalInstance],
        selectedTerminal: newTerminalInstance.uuid,
      };
    }
    case TerminalActionTypes.SELECT_TERMINAL_INSTANCE: {
      const destinationUUID = action.terminalUUID;
      const terminalInstance = state.terminals.find(singleTerminal => singleTerminal.uuid === destinationUUID);
      if (isUndefined(terminalInstance)) {
        return state;
      }
      return { ...state, selectedTerminal: terminalInstance.uuid };
    }
    case TerminalActionTypes.IMPORT_TERMINALS: {
      const terminalInstances = action.terminals;
      state.terminals.forEach((singleTerminalInstance) => {
        TerminalService.killTerminalInstance(singleTerminalInstance);
        singleTerminalInstance.xTermInstance = null;
        singleTerminalInstance.virtualTerminalInstance = null;
      });
      const createdTerminalInstances = terminalInstances.map((singleInstance) => {
        const createdTerminalInstance = TerminalService.createNewTerminalInstance(singleInstance);
        return {
          ...singleInstance,
          xTermInstance: createdTerminalInstance.xTermInstance,
          virtualTerminalInstance: createdTerminalInstance.virtualTerminalInstance,
        };
      });
      return {
        ...state,
        terminals: createdTerminalInstances,
        selectedTerminal: createdTerminalInstances.length > 0 ? createdTerminalInstances[0].uuid : '',
      };
    }
    default:
      return state;
  }
}
