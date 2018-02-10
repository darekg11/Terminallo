import { expect } from 'chai';
import ApplicationActionTypes from '../../app/actions/ApplicationActionTypes';
import ApplicationActions from '../../app/actions/ApplicationActions';

describe('actions', () => {
  it('should create an action to open new terminal modal window', () => {
    const expectedAction = {
      type: ApplicationActionTypes.ADD_TERMINAL_MODAL_WINDOW_OPEN,
    };
    expect(ApplicationActions.openAddNewTerminalModalWindow()).to.deep.equal(expectedAction);
  });

  it('should create an action to close new terminal modal window', () => {
    const expectedAction = {
      type: ApplicationActionTypes.ADD_TERMINAL_MODAL_WINDOW_CLOSE,
    };
    expect(ApplicationActions.closeAddNewTerminalModalWindow()).to.deep.equal(expectedAction);
  });
});
