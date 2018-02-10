import { expect } from 'chai';
import TerminalActionTypes from '../../app/actions/TerminalActionTypes';
import TerminalActions from '../../app/actions/TerminalActions';

describe('actions', () => {
  it('should create an action to add new terminal instance', () => {
    const expectedAction = {
      type: TerminalActionTypes.ADD_TERMINAL_INSTANCE,
      terminal: {
        terminalType: 'TERMINAL TEST TYPE',
        terminalName: 'TEST TERMINAL',
        terminalStartupDir: 'C:TestPath',
        terminalStartupCommands: ['command1', 'command2'],
      },
    };

    const terminalData = {
      terminalType: 'TERMINAL TEST TYPE',
      terminalName: 'TEST TERMINAL',
      terminalStartupDir: 'C:TestPath',
      terminalStartupCommands: ['command1', 'command2'],
    };

    expect(TerminalActions.addNewTerminalInstance(terminalData)).to.deep.equal(expectedAction);
  });

  it('should create an action to select terminal instance', () => {
    const expectedAction = {
      type: TerminalActionTypes.SELECT_TERMINAL_INSTANCE,
      terminalUUID: '123456789',
    };
    expect(TerminalActions.selectTerminalInstance('123456789')).to.deep.equal(expectedAction);
  });
});
