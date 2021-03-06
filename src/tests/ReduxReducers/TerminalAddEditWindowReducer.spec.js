import { expect } from 'chai';
import TerminalAddEditWindowReducer from '../../app/reducers/TerminalAddEditWindowReducer';
import TerminalAddEditWindowActionTypes from '../../app/actions/TerminalAddEditWindowActionTypes';

describe('TerminalAddEditWindow reducer', () => {
  it('should return initial state', () => {
    const state = TerminalAddEditWindowReducer(undefined, {});
    const expectedInitialState = {
      windowOpened: false,
      editMode: false,
      id: '',
      terminalType: '',
      terminalName: '',
      terminalStartupDir: '',
      terminalStartupCommands: [],
      terminalWatchers: [],
    };

    expect(state).to.deep.equal(expectedInitialState);
  });

  it('should handle ADD_NEW_TERMINAL_INSTANCE - bring back all default values and switch windowOpened property to true', () => {
    const initialState = {
      windowOpened: false,
      editMode: true,
      id: '1234',
      terminalType: 'CMD',
      terminalName: 'Test Terminal',
      terminalStartupDir: 'SomePath',
      terminalStartupCommands: ['cmd1', 'cmd2'],
      terminalWatchers: ['SomePath', 'Some Other  Path'],
    };

    const state = TerminalAddEditWindowReducer(initialState, {
      type: TerminalAddEditWindowActionTypes.ADD_NEW_TERMINAL_INSTANCE,
    });

    const expectedState = {
      windowOpened: true,
      editMode: false,
      id: '',
      terminalType: '',
      terminalName: '',
      terminalStartupDir: '',
      terminalStartupCommands: [],
      terminalWatchers: [],
    };

    expect(state).to.deep.equal(expectedState);
  });

  it('should handle EDIT_EXISTING_TERMINAL_INSTANCE - sets value passed in terminal object and switch windowOpened and editMode property to true', () => {
    const state = TerminalAddEditWindowReducer(undefined, {
      type: TerminalAddEditWindowActionTypes.EDIT_EXISTING_TERMINAL_INSTANCE,
      terminal: {
        id: '1234',
        terminalType: 'CMD',
        terminalName: 'Test Terminal',
        terminalStartupDir: 'SomePath',
        terminalStartupCommands: ['cmd1', 'cmd2'],
        terminalWatchers: ['SomePath', 'SomePath2'],
      },
    });

    const expectedState = {
      windowOpened: true,
      editMode: true,
      id: '1234',
      terminalType: 'CMD',
      terminalName: 'Test Terminal',
      terminalStartupDir: 'SomePath',
      terminalStartupCommands: ['cmd1', 'cmd2'],
      terminalWatchers: ['SomePath', 'SomePath2'],
    };

    expect(state).to.deep.equal(expectedState);
  });

  it('should handle ADD_EDIT_TERMINAL_MODAL_WINDOW_CLOSE - resets state to default', () => {
    const initialState = {
      windowOpened: true,
      editMode: true,
      id: '1234',
      terminalType: 'CMD',
      terminalName: 'Test Terminal',
      terminalStartupDir: 'SomePath',
      terminalStartupCommands: ['cmd1', 'cmd2'],
      terminalWatchers: ['SomePath', 'SomePath2'],
    };

    const state = TerminalAddEditWindowReducer(initialState, {
      type: TerminalAddEditWindowActionTypes.ADD_EDIT_TERMINAL_MODAL_WINDOW_CLOSE,
    });

    const expectedState = {
      windowOpened: false,
      editMode: false,
      id: '',
      terminalType: '',
      terminalName: '',
      terminalStartupDir: '',
      terminalStartupCommands: [],
      terminalWatchers: [],
    };

    expect(state).to.deep.equal(expectedState);
  });
});
