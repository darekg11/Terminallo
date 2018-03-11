import Mousetrap from 'mousetrap';
import TerminalActions from '../actions/TerminalActions';

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
};

exports.initializeDefaults = initializeDefaults;
