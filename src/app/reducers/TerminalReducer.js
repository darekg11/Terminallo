import { assign, isUndefined } from 'lodash';
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
      newTerminalInstance.uuid = createdTerminalInstance.uuid;
      newTerminalInstance.xTermInstance = createdTerminalInstance.xTermInstance;
      newTerminalInstance.virtualTerminalInstance = createdTerminalInstance.virtualTerminalInstance;
      return {
        ...state,
        terminals: [...state.terminals, newTerminalInstance],
        selectedTerminal: newTerminalInstance.uuid,
      };
    }
    case TerminalActionTypes.EDIT_TERMINAL_INSTANCE: {
      const destinationUUID = action.terminal.uuid;
      const copiedTerminalsArray = [...state.terminals];
      const terminalInstanceIndex = copiedTerminalsArray.findIndex(singleTerminal => singleTerminal.uuid === destinationUUID);
      if (terminalInstanceIndex === -1) {
        return state;
      }
      assign(copiedTerminalsArray[terminalInstanceIndex], action.terminal);
      return { ...state, terminals: copiedTerminalsArray };
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
        singleTerminalInstance.watcherInstance = null;
      });
      const createdTerminalInstances = terminalInstances.map((singleInstance) => {
        const createdTerminalInstance = TerminalService.createNewTerminalInstance(singleInstance);
        return {
          ...singleInstance,
          uuid: createdTerminalInstance.uuid,
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
    case TerminalActionTypes.RELOAD_TERMINAL_INSTANCE: {
      const { terminalUUID } = action;
      const copiedTerminalsArray = [...state.terminals];
      const terminalInstanceToReloadIndex = copiedTerminalsArray.findIndex(singleTermianl => singleTermianl.uuid === terminalUUID);
      if (terminalInstanceToReloadIndex === -1) {
        return state;
      }
      const terminalInstanceToReload = copiedTerminalsArray[terminalInstanceToReloadIndex];
      const terminalUuidBeforeReloading = terminalInstanceToReload.uuid;
      TerminalService.killTerminalInstance(terminalInstanceToReload);
      const terminalInstanceRecreated = TerminalService.createNewTerminalInstance(terminalInstanceToReload);
      const mergedReloadedInstance = {
        ...terminalInstanceToReload,
        uuid: terminalInstanceRecreated.uuid,
        xTermInstance: terminalInstanceRecreated.xTermInstance,
        virtualTerminalInstance: terminalInstanceRecreated.virtualTerminalInstance,
      };
      copiedTerminalsArray[terminalInstanceToReloadIndex] = mergedReloadedInstance;
      return {
        ...state,
        terminals: copiedTerminalsArray,
        selectedTerminal:
          terminalUuidBeforeReloading === state.selectedTerminal ? mergedReloadedInstance.uuid : state.selectedTerminal,
      };
    }
    case TerminalActionTypes.DELETE_TERMINAL_INSTANCE: {
      const { terminalUUID } = action;
      const copiedTerminalsArray = [...state.terminals];
      const terminalInstanceToDeleteIndex = copiedTerminalsArray.findIndex(singleTermianl => singleTermianl.uuid === terminalUUID);
      if (terminalInstanceToDeleteIndex === -1) {
        return state;
      }
      let uuidOfNextTerminalToSelectAfterDelete = '';
      if (copiedTerminalsArray.length === 1) {
        uuidOfNextTerminalToSelectAfterDelete = '';
      } else if (terminalInstanceToDeleteIndex === copiedTerminalsArray.length - 1) {
        const previousToLastTerminal = copiedTerminalsArray[copiedTerminalsArray.length - 2];
        uuidOfNextTerminalToSelectAfterDelete = previousToLastTerminal.uuid;
      } else {
        const nextTerminal = copiedTerminalsArray[terminalInstanceToDeleteIndex + 1];
        uuidOfNextTerminalToSelectAfterDelete = nextTerminal.uuid;
      }
      const terminalInstanceToDelete = copiedTerminalsArray[terminalInstanceToDeleteIndex];
      TerminalService.killTerminalInstance(terminalInstanceToDelete);
      terminalInstanceToDelete.xTermInstance = null;
      terminalInstanceToDelete.virtualTerminalInstance = null;
      terminalInstanceToDelete.watcherInstance = null;
      const terminalInstancesAfterDelete = copiedTerminalsArray.filter(singleTermianl => singleTermianl.uuid !== terminalUUID);
      return {
        ...state,
        terminals: terminalInstancesAfterDelete,
        selectedTerminal: uuidOfNextTerminalToSelectAfterDelete,
      };
    }
    case TerminalActionTypes.MOVE_RIGHT_TERMINAL_INSTANCE: {
      const { terminalUUID } = action;
      const copiedTerminalsArray = [...state.terminals];
      const terminalInstanceToMoveIndex = copiedTerminalsArray.findIndex(singleTermianl => singleTermianl.uuid === terminalUUID);
      if (terminalInstanceToMoveIndex === -1 || terminalInstanceToMoveIndex === copiedTerminalsArray.length - 1) {
        return state;
      }
      const nextInOrderTerminalInstanceIndex = terminalInstanceToMoveIndex + 1;
      const terminalInstanceToMove = copiedTerminalsArray[terminalInstanceToMoveIndex];
      const terminalIntanceToBeReplaced = copiedTerminalsArray[nextInOrderTerminalInstanceIndex];
      copiedTerminalsArray[nextInOrderTerminalInstanceIndex] = terminalInstanceToMove;
      copiedTerminalsArray[terminalInstanceToMoveIndex] = terminalIntanceToBeReplaced;
      return {
        ...state,
        terminals: copiedTerminalsArray,
      };
    }
    case TerminalActionTypes.MOVE_LEFT_TERMINAL_INSTANCE: {
      const { terminalUUID } = action;
      const copiedTerminalsArray = [...state.terminals];
      const terminalInstanceToMoveIndex = copiedTerminalsArray.findIndex(singleTermianl => singleTermianl.uuid === terminalUUID);
      if (terminalInstanceToMoveIndex === -1 || terminalInstanceToMoveIndex === 0) {
        return state;
      }
      const previousInOrderTerminalInstanceIndex = terminalInstanceToMoveIndex - 1;
      const terminalInstanceToMove = copiedTerminalsArray[terminalInstanceToMoveIndex];
      const terminalIntanceToBeReplaced = copiedTerminalsArray[previousInOrderTerminalInstanceIndex];
      copiedTerminalsArray[previousInOrderTerminalInstanceIndex] = terminalInstanceToMove;
      copiedTerminalsArray[terminalInstanceToMoveIndex] = terminalIntanceToBeReplaced;
      return {
        ...state,
        terminals: copiedTerminalsArray,
      };
    }
    case TerminalActionTypes.STOP_TERMINAL_INSTANCE: {
      const { terminalUUID } = action;
      const terminalInstanceToStopIndex = state.terminals.findIndex(singleTermianl => singleTermianl.uuid === terminalUUID);
      if (terminalInstanceToStopIndex !== -1) {
        const terminalInstanceToStop = state.terminals[terminalInstanceToStopIndex];
        terminalInstanceToStop.virtualTerminalInstance.write('\x03');
      }
      return state;
    }
    case TerminalActionTypes.GO_TO_NEXT_TERMINAL_INSTANCE: {
      const currentlySelectedTerminalInstance = state.selectedTerminal;
      const currentlySelectedTerminalInstanceIndex = state.terminals.findIndex(singleTerminal => singleTerminal.uuid === currentlySelectedTerminalInstance);
      if (
        currentlySelectedTerminalInstanceIndex === -1 ||
        currentlySelectedTerminalInstanceIndex === state.terminals.length - 1
      ) {
        return state;
      }
      const nextInOrderTerminalInstanceIndex = currentlySelectedTerminalInstanceIndex + 1;
      const terminalInstanceToSelect = state.terminals[nextInOrderTerminalInstanceIndex];
      return {
        ...state,
        selectedTerminal: terminalInstanceToSelect.uuid,
      };
    }
    case TerminalActionTypes.GO_TO_PREVIOUS_TERMINAL_INSTANCE: {
      const currentlySelectedTerminalInstance = state.selectedTerminal;
      const currentlySelectedTerminalInstanceIndex = state.terminals.findIndex(singleTerminal => singleTerminal.uuid === currentlySelectedTerminalInstance);
      if (currentlySelectedTerminalInstanceIndex === -1 || currentlySelectedTerminalInstanceIndex === 0) {
        return state;
      }
      const previousInOrderTerminalInstanceIndex = currentlySelectedTerminalInstanceIndex - 1;
      const terminalInstanceToSelect = state.terminals[previousInOrderTerminalInstanceIndex];
      return {
        ...state,
        selectedTerminal: terminalInstanceToSelect.uuid,
      };
    }
    default:
      return state;
  }
}
