import { batchActions } from 'redux-batched-actions';
import * as TerminalService from '../services/TerminalService';
import TerminalActionTypes from './TerminalActionTypes';
import TerminalAddEditWindowActions from './TerminalAddEditWindowActions';

const addNewTerminalInstance = terminalNewInstanceInfo => (dispatch) => {
  const createdTerminalInstanceId = TerminalService.createNewTerminalInstance(terminalNewInstanceInfo);
  const terminalConfiguration = {
    ...terminalNewInstanceInfo,
    id: createdTerminalInstanceId,
  };
  dispatch(
    batchActions([
      { type: TerminalActionTypes.ADD_TERMINAL_INSTANCE, terminal: terminalConfiguration },
      TerminalAddEditWindowActions.closeAddEditTerminalWindow(),
    ]),
  );
};

const editTerminalInstance = terminalEditInstanceInfo => (dispatch) => {
  const previousId = terminalEditInstanceInfo.id;
  const reloadedTerminalInstanceId = TerminalService.reloadTerminalInstance(previousId, terminalEditInstanceInfo);
  const updatedTerminalData = terminalEditInstanceInfo;
  updatedTerminalData.id = reloadedTerminalInstanceId;
  dispatch(
    batchActions([
      { type: TerminalActionTypes.EDIT_TERMINAL_INSTANCE, previousId, terminal: updatedTerminalData },
      TerminalAddEditWindowActions.closeAddEditTerminalWindow(),
    ]),
  );
};

const selectTerminalInstance = terminalId => ({
  type: TerminalActionTypes.SELECT_TERMINAL_INSTANCE,
  terminalId,
});

const importTerminalInstances = terminalInstances => ({
  type: TerminalActionTypes.IMPORT_TERMINALS,
  terminals: terminalInstances,
});

const reloadTerminalInstance = terminalUUID => ({
  type: TerminalActionTypes.RELOAD_TERMINAL_INSTANCE,
  terminalUUID,
});

const deleteTerminalInstance = terminalUUID => ({
  type: TerminalActionTypes.DELETE_TERMINAL_INSTANCE,
  terminalUUID,
});

const moveRightTerminalInstance = terminalUUID => ({
  type: TerminalActionTypes.MOVE_RIGHT_TERMINAL_INSTANCE,
  terminalUUID,
});

const moveLeftTerminalInstance = terminalUUID => ({
  type: TerminalActionTypes.MOVE_LEFT_TERMINAL_INSTANCE,
  terminalUUID,
});

const stopTerminalInstance = terminalUUID => ({
  type: TerminalActionTypes.STOP_TERMINAL_INSTANCE,
  terminalUUID,
});

const goToNextTerminalInstance = () => ({
  type: TerminalActionTypes.GO_TO_NEXT_TERMINAL_INSTANCE,
});

const goToPreviousTerminalInstance = () => ({
  type: TerminalActionTypes.GO_TO_PREVIOUS_TERMINAL_INSTANCE,
});

export default {
  addNewTerminalInstance,
  editTerminalInstance,
  selectTerminalInstance,
  importTerminalInstances,
  reloadTerminalInstance,
  deleteTerminalInstance,
  moveRightTerminalInstance,
  moveLeftTerminalInstance,
  stopTerminalInstance,
  goToNextTerminalInstance,
  goToPreviousTerminalInstance,
};
