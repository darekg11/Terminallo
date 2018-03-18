import { expect } from 'chai';
import AddEditTerminalWindowActionTypes from '../../app/actions/TerminalAddEditWindowActionTypes';
import AddEditTerminalWindowAction from '../../app/actions/TerminalAddEditWindowActions';

describe('actions', () => {
  it('should create an action to show add new terminal instance window', () => {
    const expectedAction = {
      type: AddEditTerminalWindowActionTypes.ADD_NEW_TERMINAL_INSTANCE,
    };

    expect(AddEditTerminalWindowAction.showAddNewTerminalWindow()).to.deep.equal(expectedAction);
  });

  it('should create an action to show edit terminal instance window', () => {
    const expectedAction = {
      type: AddEditTerminalWindowActionTypes.EDIT_EXISTING_TERMINAL_INSTANCE,
      terminal: {
        uuid: '1234',
        terminalType: 'TERMINAL TEST TYPE',
        terminalName: 'TEST TERMINAL',
        terminalStartupDir: 'C:TestPath',
        terminalStartupCommands: ['command1', 'command2'],
        terminalWatchers: ['C:TestPath', 'OtherPath'],
      },
    };

    const terminalData = {
      uuid: '1234',
      terminalType: 'TERMINAL TEST TYPE',
      terminalName: 'TEST TERMINAL',
      terminalStartupDir: 'C:TestPath',
      terminalStartupCommands: ['command1', 'command2'],
      terminalWatchers: ['C:TestPath', 'OtherPath'],
    };

    expect(AddEditTerminalWindowAction.showEditExistingTerminalWindow(terminalData)).to.deep.equal(expectedAction);
  });

  it('should create an action to close modal window', () => {
    const expectedAction = {
      type: AddEditTerminalWindowActionTypes.ADD_EDIT_TERMINAL_MODAL_WINDOW_CLOSE,
    };
    expect(AddEditTerminalWindowAction.closeAddEditTerminalWindow()).to.deep.equal(expectedAction);
  });
});
