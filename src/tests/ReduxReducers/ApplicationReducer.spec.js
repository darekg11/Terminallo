import { expect } from 'chai';
import ApplicationReducer from '../../app/reducers/ApplicationStateReducer';
import ApplicationActionTypes from '../../app/actions/ApplicationActionTypes';

describe('Application reducer', () => {
  it('should return initial state', () => {
    const state = ApplicationReducer(undefined, {});
    const expectedInitialState = {
      addNewTerminalWindowOpened: false,
      terminalsFilePath: '',
    };

    expect(state).to.deep.equal(expectedInitialState);
  });

  it('should handle ADD_TERMINAL_MODAL_WINDOW_OPEN', () => {
    const state = ApplicationReducer(undefined, {
      type: ApplicationActionTypes.ADD_TERMINAL_MODAL_WINDOW_OPEN,
    });
    const expectedState = {
      addNewTerminalWindowOpened: true,
      terminalsFilePath: '',
    };

    expect(state).to.deep.equal(expectedState);
  });

  it('should handle ADD_TERMINAL_MODAL_WINDOW_CLOSE', () => {
    const previousState = ApplicationReducer(undefined, {
      type: ApplicationActionTypes.ADD_TERMINAL_MODAL_WINDOW_OPEN,
    });

    const state = ApplicationReducer(previousState, {
      type: ApplicationActionTypes.ADD_TERMINAL_MODAL_WINDOW_CLOSE,
    });

    const expectedState = {
      addNewTerminalWindowOpened: false,
      terminalsFilePath: '',
    };

    expect(state).to.deep.equal(expectedState);
  });
});
