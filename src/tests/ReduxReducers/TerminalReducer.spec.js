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
});
