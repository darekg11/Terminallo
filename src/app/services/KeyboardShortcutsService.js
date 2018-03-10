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
};

exports.initializeDefaults = initializeDefaults;
