import { batchActions } from 'redux-batched-actions';
import * as TerminalService from '../services/TerminalService';
import * as FileService from '../services/FileService';
import ApplicationActionTypes from './ApplicationActionTypes';
import TerminalActions from './TerminalActions';
import SpinnerActions from './SpinnerActions';

const importTerminals = path => async (dispatch) => {
  dispatch(SpinnerActions.showSpinner('Importing terminals... Please wait'));
  if (path) {
    try {
      const loadedTerminalFile = await FileService.loadJsonFromFile(path);
      const mappedTerminalInstances = TerminalService.importTerminalsToObject(loadedTerminalFile);
      dispatch(batchActions([
        TerminalActions.importTerminalInstances(mappedTerminalInstances.terminals),
        SpinnerActions.showSpinnerSuccess('Terminals imported successfully.'),
      ]));
    } catch (err) {
      dispatch(SpinnerActions.showSpinnerError(`Could not import terminals :( Error: ${err.message}`));
    }
  } else {
    dispatch(SpinnerActions.showSpinnerError('Missing import file path'));
  }
};

const exportTerminals = path => async (dispatch, getState) => {
  dispatch(SpinnerActions.showSpinner('Exporting terminals... Please wait'));
  if (path) {
    try {
      const { terminals } = getState().TerminalsReducer;
      const terminalExportObject = TerminalService.exportTermninalsToObject(terminals);
      await FileService.saveJsonToFile(path, terminalExportObject);
      dispatch(SpinnerActions.showSpinnerSuccess('Terminals exported successfully.'));
    } catch (err) {
      dispatch(SpinnerActions.showSpinnerError(`Could not export terminals :( Error: ${err.message}`));
    }
  } else {
    dispatch(SpinnerActions.showSpinnerError('Missing save path'));
  }
};

const openAddNewTerminalModalWindow = () => ({
  type: ApplicationActionTypes.ADD_TERMINAL_MODAL_WINDOW_OPEN,
});

const closeAddNewTerminalModalWindow = () => ({
  type: ApplicationActionTypes.ADD_TERMINAL_MODAL_WINDOW_CLOSE,
});

exports.openAddNewTerminalModalWindow = openAddNewTerminalModalWindow;
exports.closeAddNewTerminalModalWindow = closeAddNewTerminalModalWindow;
exports.exportTerminals = exportTerminals;
exports.importTerminals = importTerminals;