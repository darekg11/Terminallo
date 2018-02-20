import electron from 'electron';
import * as TerminalService from '../services/TerminalService';
import * as FileService from '../services/FileService';
import ApplicationActionTypes from './ApplicationActionTypes';

const startExportTerminals = () => ({
  type: ApplicationActionTypes.START_EXPORT_TERMINALS,
});

const exportTerminalError = error => ({
  type: ApplicationActionTypes.ERROR_EXPORT_TERMINALS,
  error,
});

const exportTerminalSuccess = () => ({
  type: ApplicationActionTypes.SUCCESS_EXPORT_TERMINALS,
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
