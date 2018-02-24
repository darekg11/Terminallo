import electron from 'electron';
import * as TerminalService from '../services/TerminalService';
import * as FileService from '../services/FileService';
import ApplicationActionTypes from './ApplicationActionTypes';
import SpinnerActionTypes from './SpinnerActionTypes';

const startExportTerminals = () => ({
  type: SpinnerActionTypes.SPINNER_SHOW,
  loadingMessage: 'Exporting terminals... Please wait',
});

const exportTerminalError = error => ({
  type: SpinnerActionTypes.SPINNER_LOADING_ERROR,
  errorMessage: `Could not export terminals :( Error: ${error.message}`,
});

const exportTerminalSuccess = () => ({
  type: SpinnerActionTypes.SPINNER_LOADING_SUCCESS,
  successMessage: 'Terminals exported successfully.',
});

const exportTerminals = () => async (dispatch, getState) => {
  const path = electron.remote.dialog.showSaveDialog({
    title: 'Enter file name for your export',
    defaultPath: 'terminals',
    filters: [
      {
        name: 'JSON File',
        extensions: ['json'],
      },
    ],
  });
  if (path) {
    dispatch(startExportTerminals());
    try {
      const { terminals } = getState().TerminalsReducer;
      const terminalExportObject = TerminalService.exportTermninalsToObject(terminals);
      await FileService.saveJsonToFile(path, terminalExportObject);
      dispatch(exportTerminalSuccess());
    } catch (err) {
      dispatch(exportTerminalError(err));
    }
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
