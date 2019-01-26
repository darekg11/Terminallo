import { batchActions } from 'redux-batched-actions';
import * as TerminalService from '../services/TerminalService';
import TerminalActionTypes from './TerminalActionTypes';
import TerminalAddEditWindowActions from './TerminalAddEditWindowActions';

const addNewTerminalAction = terminalConfiguration => ({
  type: TerminalActionTypes.ADD_TERMINAL_INSTANCE,
  terminal: terminalConfiguration,
});

const addNewTerminalInstance = terminalNewInstanceInfo => (dispatch) => {
  const createdTerminalInstanceId = TerminalService.createNewTerminalInstance(terminalNewInstanceInfo);
  const terminalConfiguration = {
    ...terminalNewInstanceInfo,
    id: createdTerminalInstanceId,
  };
  dispatch(
    batchActions([
      addNewTerminalAction(terminalConfiguration),
      TerminalAddEditWindowActions.closeAddEditTerminalWindow(),
    ]),
  );
};

const editTerminalAction = (previousId, terminal) => ({
  type: TerminalActionTypes.EDIT_TERMINAL_INSTANCE,
  previousId,
  terminal,
});

const editTerminalInstance = terminalEditInstanceInfo => (dispatch) => {
  const previousId = terminalEditInstanceInfo.id;
  const reloadedTerminalInstanceId = TerminalService.reloadTerminalInstance(previousId, terminalEditInstanceInfo);
  const updatedTerminalData = terminalEditInstanceInfo;
  updatedTerminalData.id = reloadedTerminalInstanceId;
  dispatch(
    batchActions([
      editTerminalAction(previousId, updatedTerminalData),
      TerminalAddEditWindowActions.closeAddEditTerminalWindow(),
    ]),
  );
};

const reloadTerminalAction = (previousId, newId) => ({
  type: TerminalActionTypes.RELOAD_TERMINAL_INSTANCE,
  previousId,
  newId,
});

const reloadTerminalInstance = terminalId => (dispatch, getState) => {
  const previousId = terminalId;
  const currentTerminals = getState().TerminalsReducer.terminals;
  const configurationOfTerminal = currentTerminals.find(singleTerminal => singleTerminal.id === previousId);
  const reloadedTerminalInstanceId = TerminalService.reloadTerminalInstance(previousId, configurationOfTerminal);
  dispatch(reloadTerminalAction(previousId, reloadedTerminalInstanceId));
};

const selectTerminalInstance = terminalId => ({
  type: TerminalActionTypes.SELECT_TERMINAL_INSTANCE,
  terminalId,
});

const importTerminalsAction = terminals => ({
  type: TerminalActionTypes.IMPORT_TERMINALS,
  terminals,
});

const importTerminalInstances = terminalInstances => (dispatch) => {
  TerminalService.killAllTerminalInstances();
  const mappedCreatedTerminalInstances = terminalInstances.map((singleInstance) => {
    const createdTerminalId = TerminalService.createNewTerminalInstance(singleInstance);
    return {
      ...singleInstance,
      id: createdTerminalId,
    };
  });
  dispatch(importTerminalsAction(mappedCreatedTerminalInstances));
};

const deleteTerminalAction = terminalId => ({
  type: TerminalActionTypes.DELETE_TERMINAL_INSTANCE,
  terminalId,
});

const deleteTerminalInstance = terminalId => (dispatch) => {
  TerminalService.killTerminalInstance(terminalId);
  dispatch(deleteTerminalAction(terminalId));
};

const moveRightTerminalInstance = terminalId => ({
  type: TerminalActionTypes.MOVE_RIGHT_TERMINAL_INSTANCE,
  terminalId,
});

const moveLeftTerminalInstance = terminalId => ({
  type: TerminalActionTypes.MOVE_LEFT_TERMINAL_INSTANCE,
  terminalId,
});

const stopTerminalInstance = (terminalId) => {
  TerminalService.stopTerminalInstance(terminalId);
};

const goToNextTerminalInstance = () => ({
  type: TerminalActionTypes.GO_TO_NEXT_TERMINAL_INSTANCE,
});

const goToPreviousTerminalInstance = () => ({
  type: TerminalActionTypes.GO_TO_PREVIOUS_TERMINAL_INSTANCE,
});

export default {
  addNewTerminalAction,
  addNewTerminalInstance,
  editTerminalAction,
  editTerminalInstance,
  selectTerminalInstance,
  importTerminalsAction,
  importTerminalInstances,
  reloadTerminalAction,
  reloadTerminalInstance,
  deleteTerminalAction,
  deleteTerminalInstance,
  moveRightTerminalInstance,
  moveLeftTerminalInstance,
  stopTerminalInstance,
  goToNextTerminalInstance,
  goToPreviousTerminalInstance,
};
