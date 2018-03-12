import { combineReducers } from 'redux';
import ApplicationStateReducer from './ApplicationStateReducer';
import TerminalsReducer from './TerminalReducer';
import SpinnerReducer from './SpinnerReducer';
import TerminalAddEditWindowReducer from './TerminalAddEditWindowReducer';

export default combineReducers({
  ApplicationStateReducer,
  TerminalsReducer,
  SpinnerReducer,
  TerminalAddEditWindowReducer,
});
