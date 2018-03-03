import { expect } from 'chai';
import 'chai/register-should';
import sinon from 'sinon';
import TerminalReducer from '../../app/reducers/TerminalReducer';
import TerminalActionTypes from '../../app/actions/TerminalActionTypes';
import * as TerminalService from '../../app/services/TerminalService';

let sinonSandbox = null;

describe('Terminal reducer', () => {
  beforeEach(() => {
    sinonSandbox = sinon.sandbox.create();
  });
  afterEach(() => {
    sinonSandbox.restore();
  });
  it('should return initial state', () => {
    const state = TerminalReducer(undefined, {});
    const expectedInitialState = {
      terminals: [],
      selectedTerminal: '',
    };

    expect(state).to.deep.equal(expectedInitialState);
  });

  it('should handle ADD_TERMINAL_INSTANCE', () => {
    sinonSandbox.stub(TerminalService, 'createNewTerminalInstance').returns({
      xTermInstance: {
        fit: () => {},
        on: () => {},
        write: () => {},
      },
      virtualTerminalInstance: {
        on: () => {},
        write: () => {},
      },
    });
    const state = TerminalReducer(undefined, {
      type: TerminalActionTypes.ADD_TERMINAL_INSTANCE,
      terminal: {
        terminalType: 'CMD',
        terminalName: 'Some Test',
        terminalStartupDir: '../some',
      },
    });

    expect(state.selectedTerminal).to.not.equal('');
    expect(state.terminals.length).to.be.equal(1);
    expect(state.terminals[0].terminalName).to.be.equal('Some Test');
    expect(state.terminals[0].uuid).to.be.equal(state.selectedTerminal);
    expect(typeof state.terminals[0].xTermInstance.fit).to.be.equal('function');
    expect(typeof state.terminals[0].xTermInstance.on).to.be.equal('function');
    expect(typeof state.terminals[0].xTermInstance.write).to.be.equal('function');
    expect(typeof state.terminals[0].virtualTerminalInstance.on).to.be.equal('function');
    expect(typeof state.terminals[0].virtualTerminalInstance.write).to.be.equal('function');
  });

  it('should handle SELECT_TERMINAL_INSTANCE - select new terminal instance when it can be found', () => {
    sinonSandbox.stub(TerminalService, 'createNewTerminalInstance').returns({
      xTermInstance: {
        fit: () => {},
        on: () => {},
        write: () => {},
      },
      virtualTerminalInstance: {
        on: () => {},
        write: () => {},
      },
    });
    const state = TerminalReducer(undefined, {
      type: TerminalActionTypes.ADD_TERMINAL_INSTANCE,
      terminal: {
        terminalType: 'CMD',
        terminalName: 'Some Test',
        terminalStartupDir: '../some',
      },
    });

    const stateAfterSecondAdd = TerminalReducer(state, {
      type: TerminalActionTypes.ADD_TERMINAL_INSTANCE,
      terminal: {
        terminalType: 'CMD',
        terminalName: 'Some Test 2',
        terminalStartupDir: '../some',
      },
    });

    const finalState = TerminalReducer(stateAfterSecondAdd, {
      type: TerminalActionTypes.SELECT_TERMINAL_INSTANCE,
      terminalUUID: state.terminals[0].uuid,
    });

    expect(finalState.terminals).to.have.lengthOf(2);
    expect(finalState.selectedTerminal).to.equal(finalState.terminals[0].uuid);
    expect(finalState.terminals[0].terminalName).to.be.equal('Some Test');
    expect(finalState.terminals[0].uuid).to.not.equal('');
    expect(typeof finalState.terminals[0].xTermInstance.fit).to.be.equal('function');
    expect(typeof finalState.terminals[0].xTermInstance.on).to.be.equal('function');
    expect(typeof finalState.terminals[0].xTermInstance.write).to.be.equal('function');
    expect(typeof finalState.terminals[0].virtualTerminalInstance.on).to.be.equal('function');
    expect(typeof finalState.terminals[0].virtualTerminalInstance.write).to.be.equal('function');
    expect(finalState.terminals[1].terminalName).to.be.equal('Some Test 2');
    expect(finalState.terminals[1].uuid).to.not.equal('');
    expect(typeof finalState.terminals[1].xTermInstance.fit).to.be.equal('function');
    expect(typeof finalState.terminals[1].xTermInstance.on).to.be.equal('function');
    expect(typeof finalState.terminals[1].xTermInstance.write).to.be.equal('function');
    expect(typeof finalState.terminals[1].virtualTerminalInstance.on).to.be.equal('function');
    expect(typeof finalState.terminals[1].virtualTerminalInstance.write).to.be.equal('function');
  });

  it('should handle SELECT_TERMINAL_INSTANCE - do not select new terminal instance when it can not be found', () => {
    sinonSandbox.stub(TerminalService, 'createNewTerminalInstance').returns({
      xTermInstance: {
        fit: () => {},
        on: () => {},
        write: () => {},
      },
      virtualTerminalInstance: {
        on: () => {},
        write: () => {},
      },
    });
    const state = TerminalReducer(undefined, {
      type: TerminalActionTypes.ADD_TERMINAL_INSTANCE,
      terminal: {
        terminalType: 'CMD',
        terminalName: 'Some Test',
        terminalStartupDir: '../some',
      },
    });

    const stateAfterSecondAdd = TerminalReducer(state, {
      type: TerminalActionTypes.ADD_TERMINAL_INSTANCE,
      terminal: {
        terminalType: 'CMD',
        terminalName: 'Some Test 2',
        terminalStartupDir: '../some',
      },
    });

    const finalState = TerminalReducer(stateAfterSecondAdd, {
      type: TerminalActionTypes.SELECT_TERMINAL_INSTANCE,
      terminalUUID: 'randomValue',
    });

    expect(finalState.terminals).to.have.lengthOf(2);
    expect(finalState.selectedTerminal).to.equal(finalState.terminals[1].uuid);
    expect(finalState.terminals[0].terminalName).to.be.equal('Some Test');
    expect(finalState.terminals[0].uuid).to.not.equal('');
    expect(typeof finalState.terminals[0].xTermInstance.fit).to.be.equal('function');
    expect(typeof finalState.terminals[0].xTermInstance.on).to.be.equal('function');
    expect(typeof finalState.terminals[0].xTermInstance.write).to.be.equal('function');
    expect(typeof finalState.terminals[0].virtualTerminalInstance.on).to.be.equal('function');
    expect(typeof finalState.terminals[0].virtualTerminalInstance.write).to.be.equal('function');
    expect(finalState.terminals[1].terminalName).to.be.equal('Some Test 2');
    expect(finalState.terminals[1].uuid).to.not.equal('');
    expect(typeof finalState.terminals[1].xTermInstance.fit).to.be.equal('function');
    expect(typeof finalState.terminals[1].xTermInstance.on).to.be.equal('function');
    expect(typeof finalState.terminals[1].xTermInstance.write).to.be.equal('function');
    expect(typeof finalState.terminals[1].virtualTerminalInstance.on).to.be.equal('function');
    expect(typeof finalState.terminals[1].virtualTerminalInstance.write).to.be.equal('function');
  });

  it('should handle IMPORT_TERMINALS - importing non zero terminals', () => {
    sinonSandbox.spy(TerminalService, 'killTerminalInstance');
    sinonSandbox.stub(TerminalService, 'createNewTerminalInstance').returns({
      xTermInstance: {},
      virtualTerminalInstance: {},
    });

    const importingTerminals = [
      {
        uuid: '1234abcd',
        terminalType: 'terminalType1',
        terminalName: 'Terminal1234',
        terminalStartupDir: 'somePath',
        terminalStartupCommands: ['firstCmd', 'secondCmd'],
      },
      {
        uuid: '5678efgh',
        terminalType: 'terminalType2',
        terminalName: 'Terminal5678',
        terminalStartupDir: 'somePath2',
        terminalStartupCommands: ['firstCmd2', 'secondCmd2'],
      },
    ];

    const initialState = {
      terminals: [
        {
          terminalName: 'First terminal',
        },
        {
          terminalName: 'Second terminal',
        },
        {
          terminalName: 'Third terminal',
        },
      ],
      selectedTerminal: 'someTestUUID',
    };

    const expectedState = {
      terminals: [
        {
          uuid: '1234abcd',
          terminalType: 'terminalType1',
          terminalName: 'Terminal1234',
          terminalStartupDir: 'somePath',
          terminalStartupCommands: ['firstCmd', 'secondCmd'],
          xTermInstance: {},
          virtualTerminalInstance: {},
        },
        {
          uuid: '5678efgh',
          terminalType: 'terminalType2',
          terminalName: 'Terminal5678',
          terminalStartupDir: 'somePath2',
          terminalStartupCommands: ['firstCmd2', 'secondCmd2'],
          xTermInstance: {},
          virtualTerminalInstance: {},
        },
      ],
      selectedTerminal: '1234abcd',
    };

    const finalState = TerminalReducer(initialState, {
      type: TerminalActionTypes.IMPORT_TERMINALS,
      terminals: importingTerminals,
    });

    expect(finalState).to.deep.equal(expectedState);
    expect(TerminalService.killTerminalInstance.callCount).to.be.equal(3);
  });

  it('should handle IMPORT_TERMINALS - importing zero terminals', () => {
    sinonSandbox.spy(TerminalService, 'killTerminalInstance');
    sinonSandbox.stub(TerminalService, 'createNewTerminalInstance').returns({
      xTermInstance: {},
      virtualTerminalInstance: {},
    });

    const importingTerminals = [];

    const initialState = {
      terminals: [
        {
          terminalName: 'First terminal',
        },
        {
          terminalName: 'Second terminal',
        },
        {
          terminalName: 'Third terminal',
        },
      ],
      selectedTerminal: 'someTestUUID',
    };

    const expectedState = {
      terminals: [],
      selectedTerminal: '',
    };

    const finalState = TerminalReducer(initialState, {
      type: TerminalActionTypes.IMPORT_TERMINALS,
      terminals: importingTerminals,
    });

    expect(finalState).to.deep.equal(expectedState);
    expect(TerminalService.killTerminalInstance.callCount).to.be.equal(3);
  });

  it('should handle RELOAD_TERMINAL_INSTANCE - reloading terminal that does not exist', () => {
    const initialState = {
      terminals: [
        {
          terminalName: 'First terminal',
        },
        {
          terminalName: 'Second terminal',
        },
        {
          terminalName: 'Third terminal',
        },
      ],
      selectedTerminal: 'someTestUUID',
    };

    const expectedState = {
      terminals: [
        {
          terminalName: 'First terminal',
        },
        {
          terminalName: 'Second terminal',
        },
        {
          terminalName: 'Third terminal',
        },
      ],
      selectedTerminal: 'someTestUUID',
    };

    const finalState = TerminalReducer(initialState, {
      type: TerminalActionTypes.RELOAD_TERMINAL_INSTANCE,
      terminalUUID: 'not-existing-uuid',
    });

    expect(finalState).to.deep.equal(expectedState);
  });

  it('should handle RELOAD_TERMINAL_INSTANCE - reloading terminal that does exist', () => {
    sinonSandbox.spy(TerminalService, 'killTerminalInstance');
    sinonSandbox.stub(TerminalService, 'createNewTerminalInstance').returns({
      xTermInstance: {
        fit: () => {},
        on: () => {},
        write: () => {},
      },
      virtualTerminalInstance: {
        on: () => {},
        write: () => {},
      },
    });

    const initialState = {
      terminals: [
        {
          uuid: '1',
          terminalName: 'First terminal',
        },
        {
          uuid: '2',
          terminalName: 'Second terminal',
          terminalType: 'CMD',
          terminalStartupCommands: ['cmd1', 'cmd2'],
          terminalStartupDir: 'somePath',
          xTermInstance: {
            destroy: sinon.spy(),
          },
          virtualTerminalInstance: {
            kill: sinon.spy(),
          },
        },
        {
          uuid: '3',
          terminalName: 'Third terminal',
        },
      ],
      selectedTerminal: '2',
    };

    const firstTerminalExpected = {
      uuid: '1',
      terminalName: 'First terminal',
    };

    const thirdTerminalExpected = {
      uuid: '3',
      terminalName: 'Third terminal',
    };

    const finalState = TerminalReducer(initialState, {
      type: TerminalActionTypes.RELOAD_TERMINAL_INSTANCE,
      terminalUUID: '2',
    });

    expect(finalState.selectedTerminal).to.not.equal('2');
    expect(finalState.terminals.length).to.be.equal(3);
    expect(finalState.terminals[0]).to.deep.equal(firstTerminalExpected);
    expect(finalState.terminals[2]).to.deep.equal(thirdTerminalExpected);
    expect(finalState.terminals[1].terminalName).to.be.equal('Second terminal');
    expect(finalState.terminals[1].terminalType).to.be.equal('CMD');
    expect(finalState.terminals[1].terminalStartupCommands).to.deep.equal(['cmd1', 'cmd2']);
    expect(finalState.terminals[1].terminalStartupDir).to.deep.equal('somePath');
    expect(finalState.terminals[1].uuid).to.be.equal(finalState.selectedTerminal);
    expect(typeof finalState.terminals[1].xTermInstance.fit).to.be.equal('function');
    expect(typeof finalState.terminals[1].xTermInstance.on).to.be.equal('function');
    expect(typeof finalState.terminals[1].xTermInstance.write).to.be.equal('function');
    expect(typeof finalState.terminals[1].virtualTerminalInstance.on).to.be.equal('function');
    expect(typeof finalState.terminals[1].virtualTerminalInstance.write).to.be.equal('function');
    expect(TerminalService.killTerminalInstance.callCount).to.be.equal(1);
  });

  it('should handle DELETE_TERMINAL_INSTANCE - delete terminal that does not exist', () => {
    const initialState = {
      terminals: [
        {
          terminalName: 'First terminal',
        },
        {
          terminalName: 'Second terminal',
        },
        {
          terminalName: 'Third terminal',
        },
      ],
      selectedTerminal: 'someTestUUID',
    };

    const expectedState = {
      terminals: [
        {
          terminalName: 'First terminal',
        },
        {
          terminalName: 'Second terminal',
        },
        {
          terminalName: 'Third terminal',
        },
      ],
      selectedTerminal: 'someTestUUID',
    };

    const finalState = TerminalReducer(initialState, {
      type: TerminalActionTypes.DELETE_TERMINAL_INSTANCE,
      terminalUUID: 'not-existing-uuid',
    });

    expect(finalState).to.deep.equal(expectedState);
  });

  it('should handle DELETE_TERMINAL_INSTANCE - deleting one and only terminal instance', () => {
    const initialState = {
      terminals: [
        {
          uuid: '1',
          terminalName: 'First terminal',
        },
      ],
      selectedTerminal: '1',
    };

    const expectedState = {
      selectedTerminal: '',
      terminals: [],
    };

    const finalState = TerminalReducer(initialState, {
      type: TerminalActionTypes.DELETE_TERMINAL_INSTANCE,
      terminalUUID: '1',
    });

    expect(finalState).to.deep.equal(expectedState);
  });

  it('should handle DELETE_TERMINAL_INSTANCE - deleting last terminal instance of multiple instances', () => {
    const initialState = {
      terminals: [
        {
          uuid: '1',
          terminalName: 'First terminal',
        },
        {
          uuid: '2',
          terminalName: 'Second terminal',
        },
        {
          uuid: '3',
          terminalName: 'Third terminal',
        },
      ],
      selectedTerminal: '3',
    };

    const expectedState = {
      selectedTerminal: '2',
      terminals: [
        {
          uuid: '1',
          terminalName: 'First terminal',
        },
        {
          uuid: '2',
          terminalName: 'Second terminal',
        },
      ],
    };

    const finalState = TerminalReducer(initialState, {
      type: TerminalActionTypes.DELETE_TERMINAL_INSTANCE,
      terminalUUID: '3',
    });

    expect(finalState).to.deep.equal(expectedState);
  });

  it('should handle DELETE_TERMINAL_INSTANCE - deleting middle terminal instance of multiple instances', () => {
    const initialState = {
      terminals: [
        {
          uuid: '1',
          terminalName: 'First terminal',
        },
        {
          uuid: '2',
          terminalName: 'Second terminal',
        },
        {
          uuid: '3',
          terminalName: 'Third terminal',
        },
        {
          uuid: '4',
          terminalName: 'Fourth terminal',
        },
        {
          uuid: '5',
          terminalName: 'Fifth terminal',
        },
      ],
      selectedTerminal: '3',
    };

    const expectedState = {
      selectedTerminal: '4',
      terminals: [
        {
          uuid: '1',
          terminalName: 'First terminal',
        },
        {
          uuid: '2',
          terminalName: 'Second terminal',
        },
        {
          uuid: '4',
          terminalName: 'Fourth terminal',
        },
        {
          uuid: '5',
          terminalName: 'Fifth terminal',
        },
      ],
    };

    const finalState = TerminalReducer(initialState, {
      type: TerminalActionTypes.DELETE_TERMINAL_INSTANCE,
      terminalUUID: '3',
    });

    expect(finalState).to.deep.equal(expectedState);
  });

  it('should handle MOVE_RIGHT_TERMINAL_INSTANCE - should not change state when terminal instance does not exist', () => {
    const initialState = {
      terminals: [
        {
          uuid: '1',
          terminalName: 'First terminal',
        },
      ],
      selectedTerminal: '1',
    };

    const expectedState = {
      terminals: [
        {
          uuid: '1',
          terminalName: 'First terminal',
        },
      ],
      selectedTerminal: '1',
    };

    const finalState = TerminalReducer(initialState, {
      type: TerminalActionTypes.MOVE_RIGHT_TERMINAL_INSTANCE,
      terminalUUID: '1',
    });

    expect(finalState).to.deep.equal(expectedState);
  });

  it('should handle MOVE_RIGHT_TERMINAL_INSTANCE - should not change state when moving terminal is the last one', () => {
    const initialState = {
      terminals: [
        {
          uuid: '1',
          terminalName: 'First terminal',
        },
        {
          uuid: '2',
          terminalName: 'Second terminal',
        },
      ],
      selectedTerminal: '2',
    };

    const expectedState = {
      terminals: [
        {
          uuid: '1',
          terminalName: 'First terminal',
        },
        {
          uuid: '2',
          terminalName: 'Second terminal',
        },
      ],
      selectedTerminal: '2',
    };

    const finalState = TerminalReducer(initialState, {
      type: TerminalActionTypes.MOVE_RIGHT_TERMINAL_INSTANCE,
      terminalUUID: '2',
    });

    expect(finalState).to.deep.equal(expectedState);
  });

  it('should handle MOVE_RIGHT_TERMINAL_INSTANCE - should swap terminals places when moving terminal in the middle', () => {
    const initialState = {
      terminals: [
        {
          uuid: '1',
          terminalName: 'First terminal',
        },
        {
          uuid: '2',
          terminalName: 'Second terminal',
        },
        {
          uuid: '3',
          terminalName: 'Third terminal',
        },
        {
          uuid: '4',
          terminalName: 'Fourth terminal',
        },
        {
          uuid: '5',
          terminalName: 'Fifth terminal',
        },
      ],
      selectedTerminal: '3',
    };

    const expectedState = {
      terminals: [
        {
          uuid: '1',
          terminalName: 'First terminal',
        },
        {
          uuid: '2',
          terminalName: 'Second terminal',
        },
        {
          uuid: '4',
          terminalName: 'Fourth terminal',
        },
        {
          uuid: '3',
          terminalName: 'Third terminal',
        },
        {
          uuid: '5',
          terminalName: 'Fifth terminal',
        },
      ],
      selectedTerminal: '3',
    };

    const finalState = TerminalReducer(initialState, {
      type: TerminalActionTypes.MOVE_RIGHT_TERMINAL_INSTANCE,
      terminalUUID: '3',
    });

    expect(finalState).to.deep.equal(expectedState);
  });
});
