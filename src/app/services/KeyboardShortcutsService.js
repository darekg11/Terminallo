import Mousetrap from 'mousetrap';
import TerminalActions from '../actions/TerminalActions';
import ApplicationActions from '../actions/ApplicationActions';
import TerminalAddEditWindowActions from '../actions/TerminalAddEditWindowActions';
import * as FileService from './FileService';

const initializeDefaults = (reduxStore) => {
  Mousetrap.bind(['command+p', 'ctrl+p'], () => {
    const { selectedTerminal } = reduxStore.getState().TerminalsReducer;
    if (selectedTerminal !== '') {
      reduxStore.dispatch(TerminalActions.stopTerminalInstance(selectedTerminal));
    }
    return false;
  });

  Mousetrap.bind(['command+r', 'ctrl+r'], () => {
    const { selectedTerminal } = reduxStore.getState().TerminalsReducer;
    if (selectedTerminal !== '') {
      reduxStore.dispatch(TerminalActions.reloadTerminalInstance(selectedTerminal));
    }
    return false;
  });

  Mousetrap.bind(['command+d', 'ctrl+d'], () => {
    const { selectedTerminal } = reduxStore.getState().TerminalsReducer;
    if (selectedTerminal !== '') {
      reduxStore.dispatch(TerminalActions.deleteTerminalInstance(selectedTerminal));
    }
    return false;
  });

  Mousetrap.bind(['command+right', 'ctrl+right'], () => {
    const { selectedTerminal } = reduxStore.getState().TerminalsReducer;
    if (selectedTerminal !== '') {
      reduxStore.dispatch(TerminalActions.moveRightTerminalInstance(selectedTerminal));
    }
    return false;
  });

  Mousetrap.bind(['command+left', 'ctrl+left'], () => {
    const { selectedTerminal } = reduxStore.getState().TerminalsReducer;
    if (selectedTerminal !== '') {
      reduxStore.dispatch(TerminalActions.moveLeftTerminalInstance(selectedTerminal));
    }
    return false;
  });

  Mousetrap.bind(['alt+right'], () => {
    reduxStore.dispatch(TerminalActions.goToNextTerminalInstance());
    return false;
  });

  Mousetrap.bind(['alt+left'], () => {
    reduxStore.dispatch(TerminalActions.goToPreviousTerminalInstance());
    return false;
  });

  Mousetrap.bind(['command+s', 'ctrl+s'], () => {
    const exportFilePath = reduxStore.getState().ApplicationStateReducer.terminalsFilePath;
    if (exportFilePath !== '') {
      reduxStore.dispatch(ApplicationActions.exportTerminals(exportFilePath));
    } else {
      const windowFilters = [
        {
          name: 'JSON File',
          extensions: ['json'],
        },
      ];
      const path = FileService.showSaveFileDialog('Enter file name for your export', 'terminals', windowFilters);
      if (path) {
        reduxStore.dispatch(ApplicationActions.exportTerminals(path));
      }
    }
    return false;
  });

  Mousetrap.bind(['command+e', 'ctrl+e'], () => {
    const { selectedTerminal, terminals } = reduxStore.getState().TerminalsReducer;
    if (selectedTerminal !== '') {
      const selectedTerminalInstnace = terminals.find(singleTerminal => singleTerminal.uuid === selectedTerminal);
      reduxStore.dispatch(TerminalAddEditWindowActions.showEditExistingTerminalWindow(selectedTerminalInstnace));
    }
    return false;
  });
};

export default { initializeDefaults };
