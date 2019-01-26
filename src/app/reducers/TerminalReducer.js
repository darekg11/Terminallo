import { assign, isUndefined } from 'lodash';
import TerminalActionTypes from '../actions/TerminalActionTypes';

const initialState = {
  terminals: [],
  selectedTerminal: '',
};

export default function terminalReducer(state = initialState, action) {
  switch (action.type) {
    case TerminalActionTypes.ADD_TERMINAL_INSTANCE: {
      return {
        ...state,
        terminals: [...state.terminals, action.terminal],
        selectedTerminal: action.terminal.id,
      };
    }
    case TerminalActionTypes.EDIT_TERMINAL_INSTANCE: {
      const destinationId = action.previousId;
      const copiedTerminalsArray = [...state.terminals];
      const terminalInstanceIndex = copiedTerminalsArray.findIndex(
        singleTerminal => singleTerminal.id === destinationId,
      );
      if (terminalInstanceIndex === -1) {
        return state;
      }
      assign(copiedTerminalsArray[terminalInstanceIndex], action.terminal);
      return { ...state, terminals: copiedTerminalsArray, selectedTerminal: action.terminal.id };
    }
    case TerminalActionTypes.SELECT_TERMINAL_INSTANCE: {
      const destinationId = action.terminalId;
      const terminalInstance = state.terminals.find(singleTerminal => singleTerminal.id === destinationId);
      if (isUndefined(terminalInstance)) {
        return state;
      }
      return { ...state, selectedTerminal: terminalInstance.id };
    }
    case TerminalActionTypes.IMPORT_TERMINALS: {
      const terminalInstances = action.terminals;
      return {
        ...state,
        terminals: terminalInstances,
        selectedTerminal: terminalInstances.length > 0 ? terminalInstances[0].id : '',
      };
    }
    case TerminalActionTypes.RELOAD_TERMINAL_INSTANCE: {
      const { previousId, newId } = action;
      const copiedTerminalsArray = [...state.terminals];
      const terminalInstanceToReloadIndex = copiedTerminalsArray.findIndex(
        singleTermianl => singleTermianl.id === previousId,
      );
      if (terminalInstanceToReloadIndex === -1) {
        return state;
      }
      const terminalInstanceToReload = copiedTerminalsArray[terminalInstanceToReloadIndex];
      const mergedReloadedInstance = {
        ...terminalInstanceToReload,
        id: newId,
      };
      copiedTerminalsArray[terminalInstanceToReloadIndex] = mergedReloadedInstance;
      return {
        ...state,
        terminals: copiedTerminalsArray,
        selectedTerminal: previousId === state.selectedTerminal ? mergedReloadedInstance.id : state.selectedTerminal,
      };
    }
    case TerminalActionTypes.DELETE_TERMINAL_INSTANCE: {
      const { terminalId } = action;
      const copiedTerminalsArray = [...state.terminals];
      const terminalInstanceToDeleteIndex = copiedTerminalsArray.findIndex(
        singleTermianl => singleTermianl.id === terminalId,
      );
      if (terminalInstanceToDeleteIndex === -1) {
        return state;
      }
      let uuidOfNextTerminalToSelectAfterDelete = '';
      if (copiedTerminalsArray.length === 1) {
        uuidOfNextTerminalToSelectAfterDelete = '';
      } else if (terminalInstanceToDeleteIndex === copiedTerminalsArray.length - 1) {
        const previousToLastTerminal = copiedTerminalsArray[copiedTerminalsArray.length - 2];
        uuidOfNextTerminalToSelectAfterDelete = previousToLastTerminal.id;
      } else {
        const nextTerminal = copiedTerminalsArray[terminalInstanceToDeleteIndex + 1];
        uuidOfNextTerminalToSelectAfterDelete = nextTerminal.id;
      }
      const terminalInstancesAfterDelete = copiedTerminalsArray.filter(
        singleTermianl => singleTermianl.id !== terminalId,
      );
      return {
        ...state,
        terminals: terminalInstancesAfterDelete,
        selectedTerminal: uuidOfNextTerminalToSelectAfterDelete,
      };
    }
    case TerminalActionTypes.MOVE_RIGHT_TERMINAL_INSTANCE: {
      const { terminalId } = action;
      const copiedTerminalsArray = [...state.terminals];
      const terminalInstanceToMoveIndex = copiedTerminalsArray.findIndex(
        singleTermianl => singleTermianl.id === terminalId,
      );
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
      const { terminalId } = action;
      const copiedTerminalsArray = [...state.terminals];
      const terminalInstanceToMoveIndex = copiedTerminalsArray.findIndex(
        singleTermianl => singleTermianl.id === terminalId,
      );
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
    case TerminalActionTypes.GO_TO_NEXT_TERMINAL_INSTANCE: {
      const currentlySelectedTerminalInstance = state.selectedTerminal;
      const currentlySelectedTerminalInstanceIndex = state.terminals.findIndex(
        singleTerminal => singleTerminal.id === currentlySelectedTerminalInstance,
      );
      if (
        currentlySelectedTerminalInstanceIndex === -1
        || currentlySelectedTerminalInstanceIndex === state.terminals.length - 1
      ) {
        return state;
      }
      const nextInOrderTerminalInstanceIndex = currentlySelectedTerminalInstanceIndex + 1;
      const terminalInstanceToSelect = state.terminals[nextInOrderTerminalInstanceIndex];
      return {
        ...state,
        selectedTerminal: terminalInstanceToSelect.id,
      };
    }
    case TerminalActionTypes.GO_TO_PREVIOUS_TERMINAL_INSTANCE: {
      const currentlySelectedTerminalInstance = state.selectedTerminal;
      const currentlySelectedTerminalInstanceIndex = state.terminals.findIndex(
        singleTerminal => singleTerminal.id === currentlySelectedTerminalInstance,
      );
      if (currentlySelectedTerminalInstanceIndex === -1 || currentlySelectedTerminalInstanceIndex === 0) {
        return state;
      }
      const previousInOrderTerminalInstanceIndex = currentlySelectedTerminalInstanceIndex - 1;
      const terminalInstanceToSelect = state.terminals[previousInOrderTerminalInstanceIndex];
      return {
        ...state,
        selectedTerminal: terminalInstanceToSelect.id,
      };
    }
    default:
      return state;
  }
}
