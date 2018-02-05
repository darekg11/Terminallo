import { combineReducers } from 'redux';
import ApplicationStateReducer from './ApplicationStateReducer';
import TerminalsReducer from './TerminalReducer';

export default combineReducers({
  ApplicationStateReducer,
  TerminalsReducer,
});
