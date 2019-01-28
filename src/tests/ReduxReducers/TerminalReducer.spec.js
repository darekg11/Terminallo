import { expect } from 'chai';
import 'chai/register-should';
import TerminalReducer from '../../app/reducers/TerminalReducer';
import TerminalActionTypes from '../../app/actions/TerminalActionTypes';

describe('Terminal reducer', () => {
  it('should return initial state', () => {
    const state = TerminalReducer(undefined, {});
    const expectedInitialState = {
      terminals: [],
      selectedTerminal: '',
    };

    expect(state).to.deep.equal(expectedInitialState);
  });

  it('should handle ADD_TERMINAL_INSTANCE', () => {
    const state = TerminalReducer(undefined, {
      type: TerminalActionTypes.ADD_TERMINAL_INSTANCE,
      terminal: {
        id: '1234',
        terminalType: 'CMD',
        terminalName: 'Some Test',
        terminalStartupDir: '../some',
        terminalWatchers: ['somePath'],
      },
    });

    expect(state.selectedTerminal).to.equal('1234');
    expect(state.terminals.length).to.be.equal(1);
    expect(state.terminals[0].terminalName).to.be.equal('Some Test');
    expect(state.terminals[0].id).to.be.equal(state.selectedTerminal);
    expect(state.terminals[0].terminalType).to.be.equal('CMD');
    expect(state.terminals[0].terminalStartupDir).to.be.equal('../some');
    expect(state.terminals[0].terminalWatchers).to.deep.equal(['somePath']);
  });

  it('should handle SELECT_TERMINAL_INSTANCE - select new terminal instance when it can be found', () => {
    const state = TerminalReducer(undefined, {
      type: TerminalActionTypes.ADD_TERMINAL_INSTANCE,
      terminal: {
        id: '1234',
        terminalType: 'CMD',
        terminalName: 'Some Test',
        terminalStartupDir: '../some',
        terminalWatchers: ['somePath1'],
      },
    });

    const stateAfterSecondAdd = TerminalReducer(state, {
      type: TerminalActionTypes.ADD_TERMINAL_INSTANCE,
      terminal: {
        id: '4321',
        terminalType: 'CMD',
        terminalName: 'Some Test 2',
        terminalStartupDir: '../some',
        terminalWatchers: ['somePath2'],
      },
    });

    const finalState = TerminalReducer(stateAfterSecondAdd, {
      type: TerminalActionTypes.SELECT_TERMINAL_INSTANCE,
      terminalId: state.terminals[0].id,
    });

    expect(finalState.terminals).to.have.lengthOf(2);
    expect(finalState.selectedTerminal).to.equal(finalState.terminals[0].id);
    expect(finalState.terminals[0].terminalName).to.be.equal('Some Test');
    expect(finalState.terminals[0].id).to.equal('1234');
    expect(finalState.terminals[0].terminalType).to.be.equal('CMD');
    expect(finalState.terminals[0].terminalStartupDir).to.be.equal('../some');
    expect(finalState.terminals[0].terminalWatchers).to.deep.equal(['somePath1']);

    expect(finalState.terminals[1].terminalName).to.be.equal('Some Test 2');
    expect(finalState.terminals[1].id).to.equal('4321');
    expect(finalState.terminals[1].terminalType).to.be.equal('CMD');
    expect(finalState.terminals[1].terminalStartupDir).to.be.equal('../some');
    expect(finalState.terminals[1].terminalWatchers).to.deep.equal(['somePath2']);
  });

  it('should handle SELECT_TERMINAL_INSTANCE - do not select new terminal instance when it can not be found', () => {
    const state = TerminalReducer(undefined, {
      type: TerminalActionTypes.ADD_TERMINAL_INSTANCE,
      terminal: {
        id: '1234',
        terminalType: 'CMD',
        terminalName: 'Some Test',
        terminalStartupDir: '../some',
        terminalWatchers: ['somePath1'],
      },
    });

    const stateAfterSecondAdd = TerminalReducer(state, {
      type: TerminalActionTypes.ADD_TERMINAL_INSTANCE,
      terminal: {
        id: '5678',
        terminalType: 'CMD',
        terminalName: 'Some Test 2',
        terminalStartupDir: '../some',
        terminalWatchers: ['somePath2'],
      },
    });

    const finalState = TerminalReducer(stateAfterSecondAdd, {
      type: TerminalActionTypes.SELECT_TERMINAL_INSTANCE,
      terminalId: 'randomValue',
    });

    expect(finalState.terminals).to.have.lengthOf(2);
    expect(finalState.selectedTerminal).to.equal(finalState.terminals[1].id);
    expect(finalState.terminals[0].terminalName).to.be.equal('Some Test');
    expect(finalState.terminals[0].id).equal('1234');
    expect(finalState.terminals[0].terminalType).to.be.equal('CMD');
    expect(finalState.terminals[0].terminalStartupDir).to.be.equal('../some');
    expect(finalState.terminals[0].terminalWatchers).to.deep.equal(['somePath1']);

    expect(finalState.terminals[1].terminalName).to.be.equal('Some Test 2');
    expect(finalState.terminals[1].id).to.equal('5678');
    expect(finalState.terminals[1].terminalType).to.be.equal('CMD');
    expect(finalState.terminals[1].terminalStartupDir).to.be.equal('../some');
    expect(finalState.terminals[1].terminalWatchers).to.deep.equal(['somePath2']);
  });

  it('should handle IMPORT_TERMINALS - importing non zero terminals', () => {
    const importingTerminals = [
      {
        id: '1234abcd',
        terminalType: 'terminalType1',
        terminalName: 'Terminal1234',
        terminalStartupDir: 'somePath',
        terminalStartupCommands: ['firstCmd', 'secondCmd'],
      },
      {
        id: '5678efgh',
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
          id: '1234abcd',
          terminalType: 'terminalType1',
          terminalName: 'Terminal1234',
          terminalStartupDir: 'somePath',
          terminalStartupCommands: ['firstCmd', 'secondCmd'],
        },
        {
          id: '5678efgh',
          terminalType: 'terminalType2',
          terminalName: 'Terminal5678',
          terminalStartupDir: 'somePath2',
          terminalStartupCommands: ['firstCmd2', 'secondCmd2'],
        },
      ],
      selectedTerminal: '1234abcd',
    };

    const finalState = TerminalReducer(initialState, {
      type: TerminalActionTypes.IMPORT_TERMINALS,
      terminals: importingTerminals,
    });

    expect(finalState).to.deep.equal(expectedState);
  });

  it('should handle IMPORT_TERMINALS - importing zero terminals', () => {
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
  });

  it('should handle RELOAD_TERMINAL_INSTANCE - reloading terminal that does not exist', () => {
    const initialState = {
      terminals: [
        {
          id: '1234',
          terminalName: 'First terminal',
        },
        {
          id: '5678',
          terminalName: 'Second terminal',
        },
        {
          id: '90',
          terminalName: 'Third terminal',
        },
      ],
      selectedTerminal: '1234',
    };

    const expectedState = {
      terminals: [
        {
          id: '1234',
          terminalName: 'First terminal',
        },
        {
          id: '5678',
          terminalName: 'Second terminal',
        },
        {
          id: '90',
          terminalName: 'Third terminal',
        },
      ],
      selectedTerminal: '1234',
    };

    const finalState = TerminalReducer(initialState, {
      type: TerminalActionTypes.RELOAD_TERMINAL_INSTANCE,
      previousId: '5555',
      newId: '1111',
    });

    expect(finalState).to.deep.equal(expectedState);
  });

  it('should handle RELOAD_TERMINAL_INSTANCE - reloading terminal that does exist', () => {
    const initialState = {
      terminals: [
        {
          id: '1',
          terminalName: 'First terminal',
        },
        {
          id: '2',
          terminalName: 'Second terminal',
          terminalType: 'CMD',
          terminalStartupCommands: ['cmd1', 'cmd2'],
          terminalStartupDir: 'somePath',
        },
        {
          id: '3',
          terminalName: 'Third terminal',
        },
      ],
      selectedTerminal: '2',
    };

    const firstTerminalExpected = {
      id: '1',
      terminalName: 'First terminal',
    };

    const thirdTerminalExpected = {
      id: '3',
      terminalName: 'Third terminal',
    };

    const finalState = TerminalReducer(initialState, {
      type: TerminalActionTypes.RELOAD_TERMINAL_INSTANCE,
      previousId: '2',
      newId: '4',
    });

    expect(finalState.selectedTerminal).to.not.equal('2');
    expect(finalState.terminals.length).to.be.equal(3);
    expect(finalState.terminals[0]).to.deep.equal(firstTerminalExpected);
    expect(finalState.terminals[2]).to.deep.equal(thirdTerminalExpected);
    expect(finalState.terminals[1].terminalName).to.be.equal('Second terminal');
    expect(finalState.terminals[1].terminalType).to.be.equal('CMD');
    expect(finalState.terminals[1].terminalStartupCommands).to.deep.equal(['cmd1', 'cmd2']);
    expect(finalState.terminals[1].terminalStartupDir).to.deep.equal('somePath');
    expect(finalState.terminals[1].id).to.be.equal(finalState.selectedTerminal);
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
      terminalId: 'not-existing-uuid',
    });

    expect(finalState).to.deep.equal(expectedState);
  });

  it('should handle DELETE_TERMINAL_INSTANCE - deleting one and only terminal instance', () => {
    const initialState = {
      terminals: [
        {
          id: '1',
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
      terminalId: '1',
    });

    expect(finalState).to.deep.equal(expectedState);
  });

  it('should handle DELETE_TERMINAL_INSTANCE - deleting last terminal instance of multiple instances', () => {
    const initialState = {
      terminals: [
        {
          id: '1',
          terminalName: 'First terminal',
        },
        {
          id: '2',
          terminalName: 'Second terminal',
        },
        {
          id: '3',
          terminalName: 'Third terminal',
        },
      ],
      selectedTerminal: '3',
    };

    const expectedState = {
      selectedTerminal: '2',
      terminals: [
        {
          id: '1',
          terminalName: 'First terminal',
        },
        {
          id: '2',
          terminalName: 'Second terminal',
        },
      ],
    };

    const finalState = TerminalReducer(initialState, {
      type: TerminalActionTypes.DELETE_TERMINAL_INSTANCE,
      terminalId: '3',
    });

    expect(finalState).to.deep.equal(expectedState);
  });

  it('should handle DELETE_TERMINAL_INSTANCE - deleting middle terminal instance of multiple instances', () => {
    const initialState = {
      terminals: [
        {
          id: '1',
          terminalName: 'First terminal',
        },
        {
          id: '2',
          terminalName: 'Second terminal',
        },
        {
          id: '3',
          terminalName: 'Third terminal',
        },
        {
          id: '4',
          terminalName: 'Fourth terminal',
        },
        {
          id: '5',
          terminalName: 'Fifth terminal',
        },
      ],
      selectedTerminal: '3',
    };

    const expectedState = {
      selectedTerminal: '4',
      terminals: [
        {
          id: '1',
          terminalName: 'First terminal',
        },
        {
          id: '2',
          terminalName: 'Second terminal',
        },
        {
          id: '4',
          terminalName: 'Fourth terminal',
        },
        {
          id: '5',
          terminalName: 'Fifth terminal',
        },
      ],
    };

    const finalState = TerminalReducer(initialState, {
      type: TerminalActionTypes.DELETE_TERMINAL_INSTANCE,
      terminalId: '3',
    });

    expect(finalState).to.deep.equal(expectedState);
  });

  it('should handle MOVE_RIGHT_TERMINAL_INSTANCE - should not change state when terminal instance does not exist', () => {
    const initialState = {
      terminals: [
        {
          id: '1',
          terminalName: 'First terminal',
        },
      ],
      selectedTerminal: '1',
    };

    const expectedState = {
      terminals: [
        {
          id: '1',
          terminalName: 'First terminal',
        },
      ],
      selectedTerminal: '1',
    };

    const finalState = TerminalReducer(initialState, {
      type: TerminalActionTypes.MOVE_RIGHT_TERMINAL_INSTANCE,
      terminalId: '2',
    });

    expect(finalState).to.deep.equal(expectedState);
  });

  it('should handle MOVE_RIGHT_TERMINAL_INSTANCE - should not change state when moving terminal is the last one', () => {
    const initialState = {
      terminals: [
        {
          id: '1',
          terminalName: 'First terminal',
        },
        {
          id: '2',
          terminalName: 'Second terminal',
        },
      ],
      selectedTerminal: '2',
    };

    const expectedState = {
      terminals: [
        {
          id: '1',
          terminalName: 'First terminal',
        },
        {
          id: '2',
          terminalName: 'Second terminal',
        },
      ],
      selectedTerminal: '2',
    };

    const finalState = TerminalReducer(initialState, {
      type: TerminalActionTypes.MOVE_RIGHT_TERMINAL_INSTANCE,
      terminalId: '2',
    });

    expect(finalState).to.deep.equal(expectedState);
  });

  it('should handle MOVE_RIGHT_TERMINAL_INSTANCE - should swap terminals places when moving terminal in the middle', () => {
    const initialState = {
      terminals: [
        {
          id: '1',
          terminalName: 'First terminal',
        },
        {
          id: '2',
          terminalName: 'Second terminal',
        },
        {
          id: '3',
          terminalName: 'Third terminal',
        },
        {
          id: '4',
          terminalName: 'Fourth terminal',
        },
        {
          id: '5',
          terminalName: 'Fifth terminal',
        },
      ],
      selectedTerminal: '3',
    };

    const expectedState = {
      terminals: [
        {
          id: '1',
          terminalName: 'First terminal',
        },
        {
          id: '2',
          terminalName: 'Second terminal',
        },
        {
          id: '4',
          terminalName: 'Fourth terminal',
        },
        {
          id: '3',
          terminalName: 'Third terminal',
        },
        {
          id: '5',
          terminalName: 'Fifth terminal',
        },
      ],
      selectedTerminal: '3',
    };

    const finalState = TerminalReducer(initialState, {
      type: TerminalActionTypes.MOVE_RIGHT_TERMINAL_INSTANCE,
      terminalId: '3',
    });

    expect(finalState).to.deep.equal(expectedState);
  });

  it('should handle MOVE_LEFT_TERMINAL_INSTANCE - should not change state when terminal instance does not exist', () => {
    const initialState = {
      terminals: [
        {
          id: '1',
          terminalName: 'First terminal',
        },
      ],
      selectedTerminal: '1',
    };

    const expectedState = {
      terminals: [
        {
          id: '1',
          terminalName: 'First terminal',
        },
      ],
      selectedTerminal: '1',
    };

    const finalState = TerminalReducer(initialState, {
      type: TerminalActionTypes.MOVE_LEFT_TERMINAL_INSTANCE,
      terminalId: '4',
    });

    expect(finalState).to.deep.equal(expectedState);
  });

  it('should handle MOVE_LEFT_TERMINAL_INSTANCE - should not change state when moving terminal is the first one', () => {
    const initialState = {
      terminals: [
        {
          id: '1',
          terminalName: 'First terminal',
        },
        {
          id: '2',
          terminalName: 'Second terminal',
        },
      ],
      selectedTerminal: '1',
    };

    const expectedState = {
      terminals: [
        {
          id: '1',
          terminalName: 'First terminal',
        },
        {
          id: '2',
          terminalName: 'Second terminal',
        },
      ],
      selectedTerminal: '1',
    };

    const finalState = TerminalReducer(initialState, {
      type: TerminalActionTypes.MOVE_LEFT_TERMINAL_INSTANCE,
      terminalId: '1',
    });

    expect(finalState).to.deep.equal(expectedState);
  });

  it('should handle MOVE_LEFT_TERMINAL_INSTANCE - should swap terminals places when moving terminal in the middle', () => {
    const initialState = {
      terminals: [
        {
          id: '1',
          terminalName: 'First terminal',
        },
        {
          id: '2',
          terminalName: 'Second terminal',
        },
        {
          id: '3',
          terminalName: 'Third terminal',
        },
        {
          id: '4',
          terminalName: 'Fourth terminal',
        },
        {
          id: '5',
          terminalName: 'Fifth terminal',
        },
      ],
      selectedTerminal: '3',
    };

    const expectedState = {
      terminals: [
        {
          id: '1',
          terminalName: 'First terminal',
        },
        {
          id: '3',
          terminalName: 'Third terminal',
        },
        {
          id: '2',
          terminalName: 'Second terminal',
        },
        {
          id: '4',
          terminalName: 'Fourth terminal',
        },
        {
          id: '5',
          terminalName: 'Fifth terminal',
        },
      ],
      selectedTerminal: '3',
    };

    const finalState = TerminalReducer(initialState, {
      type: TerminalActionTypes.MOVE_LEFT_TERMINAL_INSTANCE,
      terminalId: '3',
    });

    expect(finalState).to.deep.equal(expectedState);
  });

  it('should handle GO_TO_NEXT_TERMINAL_INSTANCE - should not change state when terminal instance does not exist', () => {
    const initialState = {
      terminals: [
        {
          id: '1',
          terminalName: 'First terminal',
        },
      ],
      selectedTerminal: '1234abcd',
    };

    const expectedState = {
      terminals: [
        {
          id: '1',
          terminalName: 'First terminal',
        },
      ],
      selectedTerminal: '1234abcd',
    };

    const finalState = TerminalReducer(initialState, {
      type: TerminalActionTypes.GO_TO_NEXT_TERMINAL_INSTANCE,
    });

    expect(finalState).to.deep.equal(expectedState);
  });

  it('should handle GO_TO_NEXT_TERMINAL_INSTANCE - should not change state when selected terminal is the last one', () => {
    const initialState = {
      terminals: [
        {
          id: '1',
          terminalName: 'First terminal',
        },
        {
          id: '2',
          terminalName: 'Second terminal',
        },
      ],
      selectedTerminal: '2',
    };

    const expectedState = {
      terminals: [
        {
          id: '1',
          terminalName: 'First terminal',
        },
        {
          id: '2',
          terminalName: 'Second terminal',
        },
      ],
      selectedTerminal: '2',
    };

    const finalState = TerminalReducer(initialState, {
      type: TerminalActionTypes.GO_TO_NEXT_TERMINAL_INSTANCE,
    });

    expect(finalState).to.deep.equal(expectedState);
  });

  it('should handle GO_TO_NEXT_TERMINAL_INSTANCE - should change terminal when selected terminal is in the middle', () => {
    const initialState = {
      terminals: [
        {
          id: '1',
          terminalName: 'First terminal',
        },
        {
          id: '2',
          terminalName: 'Second terminal',
        },
        {
          id: '3',
          terminalName: 'Third terminal',
        },
        {
          id: '4',
          terminalName: 'Fourth terminal',
        },
        {
          id: '5',
          terminalName: 'Fifth terminal',
        },
      ],
      selectedTerminal: '3',
    };

    const expectedState = {
      terminals: [
        {
          id: '1',
          terminalName: 'First terminal',
        },
        {
          id: '2',
          terminalName: 'Second terminal',
        },
        {
          id: '3',
          terminalName: 'Third terminal',
        },
        {
          id: '4',
          terminalName: 'Fourth terminal',
        },
        {
          id: '5',
          terminalName: 'Fifth terminal',
        },
      ],
      selectedTerminal: '4',
    };

    const finalState = TerminalReducer(initialState, {
      type: TerminalActionTypes.GO_TO_NEXT_TERMINAL_INSTANCE,
    });

    expect(finalState).to.deep.equal(expectedState);
  });

  it('should handle GO_TO_PREVIOUS_TERMINAL_INSTANCE - should not change state when terminal instance does not exist', () => {
    const initialState = {
      terminals: [
        {
          id: '1',
          terminalName: 'First terminal',
        },
      ],
      selectedTerminal: '1234abcd',
    };

    const expectedState = {
      terminals: [
        {
          id: '1',
          terminalName: 'First terminal',
        },
      ],
      selectedTerminal: '1234abcd',
    };

    const finalState = TerminalReducer(initialState, {
      type: TerminalActionTypes.GO_TO_PREVIOUS_TERMINAL_INSTANCE,
    });

    expect(finalState).to.deep.equal(expectedState);
  });

  it('should handle GO_TO_PREVIOUS_TERMINAL_INSTANCE - should not change state when selected terminal is the first one', () => {
    const initialState = {
      terminals: [
        {
          id: '1',
          terminalName: 'First terminal',
        },
        {
          id: '2',
          terminalName: 'Second terminal',
        },
      ],
      selectedTerminal: '1',
    };

    const expectedState = {
      terminals: [
        {
          id: '1',
          terminalName: 'First terminal',
        },
        {
          id: '2',
          terminalName: 'Second terminal',
        },
      ],
      selectedTerminal: '1',
    };

    const finalState = TerminalReducer(initialState, {
      type: TerminalActionTypes.GO_TO_PREVIOUS_TERMINAL_INSTANCE,
    });

    expect(finalState).to.deep.equal(expectedState);
  });

  it('should handle GO_TO_PREVIOUS_TERMINAL_INSTANCE - should change terminal when selected terminal is in the middle', () => {
    const initialState = {
      terminals: [
        {
          id: '1',
          terminalName: 'First terminal',
        },
        {
          id: '2',
          terminalName: 'Second terminal',
        },
        {
          id: '3',
          terminalName: 'Third terminal',
        },
        {
          id: '4',
          terminalName: 'Fourth terminal',
        },
        {
          id: '5',
          terminalName: 'Fifth terminal',
        },
      ],
      selectedTerminal: '3',
    };

    const expectedState = {
      terminals: [
        {
          id: '1',
          terminalName: 'First terminal',
        },
        {
          id: '2',
          terminalName: 'Second terminal',
        },
        {
          id: '3',
          terminalName: 'Third terminal',
        },
        {
          id: '4',
          terminalName: 'Fourth terminal',
        },
        {
          id: '5',
          terminalName: 'Fifth terminal',
        },
      ],
      selectedTerminal: '2',
    };

    const finalState = TerminalReducer(initialState, {
      type: TerminalActionTypes.GO_TO_PREVIOUS_TERMINAL_INSTANCE,
    });

    expect(finalState).to.deep.equal(expectedState);
  });

  it('should handle EDIT_TERMINAL_INSTANCE - should not change state when terminal instance does not exist', () => {
    const initialState = {
      terminals: [
        {
          id: '1',
          terminalName: 'First terminal',
          terminalType: 'CMD',
          terminalStartupDir: 'somePath',
          terminalStartupCommands: ['cmd1', 'cmd2'],
        },
      ],
      selectedTerminal: '1234abcd',
    };

    const expectedState = {
      terminals: [
        {
          id: '1',
          terminalName: 'First terminal',
          terminalType: 'CMD',
          terminalStartupDir: 'somePath',
          terminalStartupCommands: ['cmd1', 'cmd2'],
        },
      ],
      selectedTerminal: '1234abcd',
    };

    const finalState = TerminalReducer(initialState, {
      type: TerminalActionTypes.EDIT_TERMINAL_INSTANCE,
      previousId: 'randomBlabla',
      terminal: {
        id: '5678',
        terminalName: 'First Edited Name',
        terminalType: 'CMD Edited',
        terminalStartupDir: 'somePath Edited',
        terminalStartupCommands: ['cmd1 Edited', 'cmd2 Edited'],
      },
    });

    expect(finalState).to.deep.equal(expectedState);
  });

  it('should handle EDIT_TERMINAL_INSTANCE - should change state when terminal instance exists', () => {
    const initialState = {
      terminals: [
        {
          id: '1',
          terminalName: 'First terminal',
          terminalType: 'CMD',
          terminalStartupDir: 'somePath',
          terminalStartupCommands: ['cmd1', 'cmd2'],
        },
      ],
      selectedTerminal: '1234abcd',
    };

    const expectedState = {
      terminals: [
        {
          id: '4',
          terminalName: 'First Edited Name',
          terminalType: 'CMD Edited',
          terminalStartupDir: 'somePath Edited',
          terminalStartupCommands: ['cmd1 Edited', 'cmd2 Edited'],
        },
      ],
      selectedTerminal: '4',
    };

    const finalState = TerminalReducer(initialState, {
      type: TerminalActionTypes.EDIT_TERMINAL_INSTANCE,
      previousId: '1',
      terminal: {
        id: '4',
        terminalName: 'First Edited Name',
        terminalType: 'CMD Edited',
        terminalStartupDir: 'somePath Edited',
        terminalStartupCommands: ['cmd1 Edited', 'cmd2 Edited'],
      },
    });

    expect(finalState).to.deep.equal(expectedState);
  });
});
