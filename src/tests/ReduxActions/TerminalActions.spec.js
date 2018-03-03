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

  it('should create an action to export terminal instances', () => {
    const expectedAction = {
      type: TerminalActionTypes.IMPORT_TERMINALS,
      terminals: [
        {
          terminalName: 'test1',
        },
        {
          terminalName: 'test2',
        },
      ],
    };
    const testTerminalInstances = [
      {
        terminalName: 'test1',
      },
      {
        terminalName: 'test2',
      },
    ];
    expect(TerminalActions.importTerminalInstances(testTerminalInstances)).to.deep.equal(expectedAction);
  });

  it('should create an action to reload terminal instance', () => {
    const expectedAction = {
      type: TerminalActionTypes.RELOAD_TERMINAL_INSTANCE,
      terminalUUID: '123456789',
    };
    expect(TerminalActions.reloadTerminalInstance('123456789')).to.deep.equal(expectedAction);
  });

  it('should create an action to delete terminal instance', () => {
    const expectedAction = {
      type: TerminalActionTypes.DELETE_TERMINAL_INSTANCE,
      terminalUUID: '123456789',
    };
    expect(TerminalActions.deleteTerminalInstance('123456789')).to.deep.equal(expectedAction);
  });

  it('should create an action to move terminal instance to right', () => {
    const expectedAction = {
      type: TerminalActionTypes.MOVE_RIGHT_TERMINAL_INSTANCE,
      terminalUUID: '123456789',
    };
    expect(TerminalActions.moveRightTerminalInstance('123456789')).to.deep.equal(expectedAction);
  });

  it('should create an action to move terminal instance to left', () => {
    const expectedAction = {
      type: TerminalActionTypes.MOVE_LEFT_TERMINAL_INSTANCE,
      terminalUUID: '123456789',
    };
    expect(TerminalActions.moveLeftTerminalInstance('123456789')).to.deep.equal(expectedAction);
  });
});
