import Mousetrap from 'mousetrap';
import TerminalActions from '../actions/TerminalActions';
import ApplicationActions from '../actions/ApplicationActions';
import TerminalAddEditWindowActions from '../actions/TerminalAddEditWindowActions';
import * as FileService from './FileService';

const initializeDefaults = (reduxStore) => {
  Mousetrap.bind(['alt+p'], () => {
    const { selectedTerminal } = reduxStore.getState().TerminalsReducer;
    if (selectedTerminal !== '') {
      reduxStore.dispatch(TerminalActions.stopTerminalInstance(selectedTerminal));
    }
    return false;
  });

  Mousetrap.bind(['alt+r'], () => {
    const { selectedTerminal } = reduxStore.getState().TerminalsReducer;
    if (selectedTerminal !== '') {
      reduxStore.dispatch(TerminalActions.reloadTerminalInstance(selectedTerminal));
    }
    return false;
  });

  Mousetrap.bind(['alt+d'], () => {
    const { selectedTerminal } = reduxStore.getState().TerminalsReducer;
    if (selectedTerminal !== '') {
      reduxStore.dispatch(TerminalActions.deleteTerminalInstance(selectedTerminal));
    }
    return false;
  });

  Mousetrap.bind(['alt+right'], () => {
    const { selectedTerminal } = reduxStore.getState().TerminalsReducer;
    if (selectedTerminal !== '') {
      reduxStore.dispatch(TerminalActions.moveRightTerminalInstance(selectedTerminal));
    }
    return false;
  });

  Mousetrap.bind(['alt+left'], () => {
    const { selectedTerminal } = reduxStore.getState().TerminalsReducer;
    if (selectedTerminal !== '') {
      reduxStore.dispatch(TerminalActions.moveLeftTerminalInstance(selectedTerminal));
    }
    return false;
  });

  Mousetrap.bind(['shift+right'], () => {
    reduxStore.dispatch(TerminalActions.goToNextTerminalInstance());
    return false;
  });

  Mousetrap.bind(['shift+left'], () => {
    reduxStore.dispatch(TerminalActions.goToPreviousTerminalInstance());
    return false;
  });

  Mousetrap.bind(['alt+s'], () => {
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

  Mousetrap.bind(['alt+e'], () => {
    const { selectedTerminal, terminals } = reduxStore.getState().TerminalsReducer;
    if (selectedTerminal !== '') {
      const selectedTerminalInstnace = terminals.find(singleTerminal => singleTerminal.uuid === selectedTerminal);
      reduxStore.dispatch(TerminalAddEditWindowActions.showEditExistingTerminalWindow(selectedTerminalInstnace));
    }
    return false;
  });
};

export default { initializeDefaults };
