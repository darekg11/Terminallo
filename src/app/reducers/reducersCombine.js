import { combineReducers } from 'redux';
import ApplicationStateReducer from './ApplicationStateReducer';
import TerminalsReducer from './TerminalReducer';
import SpinnerReducer from './SpinnerReducer';

export default combineReducers({
  ApplicationStateReducer,
  TerminalsReducer,
  SpinnerReducer,
});
