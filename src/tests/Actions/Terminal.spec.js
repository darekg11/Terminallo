import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import sinon from 'sinon';
import * as TerminalService from '../../app/services/TerminalService';
import TerminalAddEditWindowActionTypes from '../../app/actions/TerminalAddEditWindowActionTypes';
import TerminalActionTypes from '../../app/actions/TerminalActionTypes';
import TerminalActions from '../../app/actions/TerminalActions';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
let sinonSandbox = null;

describe('Terminal - Logic actions', () => {
  beforeEach(() => {
    sinonSandbox = sinon.createSandbox();
  });
  afterEach(() => {
    sinonSandbox.restore();
  });

  it('should create an action to add new terminal instance', () => {
    sinonSandbox.stub(TerminalService, 'createNewTerminalInstance').returns('12345678');
    const mockedNewTerminalInstance = {
      terminalType: 'CMD',
      terminalName: 'Test Terminal',
      terminalStartupDir: '/root/whatever',
      terminalStartupCommands: ['pwd', 'ls -l'],
      terminalWatchers: ['/home/test', '/home/test2'],
    };
    const expectedActions = [
      {
        type: 'BATCHING_REDUCER.BATCH',
        meta: { batch: true },
        payload: [
          {
            type: TerminalActionTypes.ADD_TERMINAL_INSTANCE,
            terminal: {
              id: '12345678',
              terminalType: 'CMD',
              terminalName: 'Test Terminal',
              terminalStartupDir: '/root/whatever',
              terminalStartupCommands: ['pwd', 'ls -l'],
              terminalWatchers: ['/home/test', '/home/test2'],
            },
          },
          {
            type: TerminalAddEditWindowActionTypes.ADD_EDIT_TERMINAL_MODAL_WINDOW_CLOSE,
          },
        ],
      },
    ];
    const store = mockStore({
      TerminalsReducer: {
        terminals: [],
        selectedTerminal: '',
      },
    });
    store.dispatch(TerminalActions.addNewTerminalInstance(mockedNewTerminalInstance));
    expect(store.getActions()).to.deep.equal(expectedActions);
  });

  it('should create an action to edit existing terminal instance', () => {
    sinonSandbox.stub(TerminalService, 'reloadTerminalInstance').returns('1234');
    const mockedEditedTerminalInstance = {
      id: '1111',
      terminalType: 'CMD',
      terminalName: 'Test Terminal',
      terminalStartupDir: '/root/whatever',
      terminalStartupCommands: ['pwd', 'ls -l'],
      terminalWatchers: ['/home/test', '/home/test2'],
    };
    const expectedActions = [
      {
        type: 'BATCHING_REDUCER.BATCH',
        meta: { batch: true },
        payload: [
          {
            type: TerminalActionTypes.EDIT_TERMINAL_INSTANCE,
            previousId: '1111',
            terminal: {
              id: '1234',
              terminalType: 'CMD',
              terminalName: 'Test Terminal',
              terminalStartupDir: '/root/whatever',
              terminalStartupCommands: ['pwd', 'ls -l'],
              terminalWatchers: ['/home/test', '/home/test2'],
            },
          },
          {
            type: TerminalAddEditWindowActionTypes.ADD_EDIT_TERMINAL_MODAL_WINDOW_CLOSE,
          },
        ],
      },
    ];
    const store = mockStore({
      TerminalsReducer: {
        terminals: [],
        selectedTerminal: '',
      },
    });
    store.dispatch(TerminalActions.editTerminalInstance(mockedEditedTerminalInstance));
    expect(store.getActions()).to.deep.equal(expectedActions);
  });

  it('should create an action to reload existing terminal instance', () => {
    sinonSandbox.stub(TerminalService, 'reloadTerminalInstance').returns('1234');
    const mockedTerminalId = '1111';
    const expectedActions = [
      {
        type: TerminalActionTypes.RELOAD_TERMINAL_INSTANCE,
        previousId: '1111',
        newId: '1234',
      },
    ];
    const store = mockStore({
      TerminalsReducer: {
        terminals: [
          {
            id: '1111',
          },
        ],
        selectedTerminal: '',
      },
    });
    store.dispatch(TerminalActions.reloadTerminalInstance(mockedTerminalId));
    expect(store.getActions()).to.deep.equal(expectedActions);
  });

  it('should create an action to import terminal instances', () => {
    sinonSandbox.stub(TerminalService, 'killAllTerminalInstances').returns();
    const createTerminalStub = sinonSandbox.stub(TerminalService, 'createNewTerminalInstance');
    createTerminalStub.onCall(0).returns('1234');
    createTerminalStub.onCall(1).returns('4321');
    const mockedTerminalInstancesToImport = [
      {
        terminalType: 'CMD',
        terminalName: 'Test Terminal',
        terminalStartupDir: '/root/whatever',
        terminalStartupCommands: ['pwd', 'ls -l'],
        terminalWatchers: ['/home/test', '/home/test2'],
      },
      {
        terminalType: 'ZSH',
        terminalName: 'Test Terminal2',
        terminalStartupDir: '/root/whatever',
        terminalStartupCommands: ['ls -l', 'sudo su'],
        terminalWatchers: ['/home/documents/tests', '/etc/'],
      },
    ];
    const expectedActions = [
      {
        type: TerminalActionTypes.IMPORT_TERMINALS,
        terminals: [
          {
            id: '1234',
            terminalType: 'CMD',
            terminalName: 'Test Terminal',
            terminalStartupDir: '/root/whatever',
            terminalStartupCommands: ['pwd', 'ls -l'],
            terminalWatchers: ['/home/test', '/home/test2'],
          },
          {
            id: '4321',
            terminalType: 'ZSH',
            terminalName: 'Test Terminal2',
            terminalStartupDir: '/root/whatever',
            terminalStartupCommands: ['ls -l', 'sudo su'],
            terminalWatchers: ['/home/documents/tests', '/etc/'],
          },
        ],
      },
    ];
    const store = mockStore({
      TerminalsReducer: {
        terminals: [],
        selectedTerminal: '',
      },
    });
    store.dispatch(TerminalActions.importTerminalInstances(mockedTerminalInstancesToImport));
    expect(store.getActions()).to.deep.equal(expectedActions);
  });

  it('should create an action to delete terminal instances', () => {
    sinonSandbox.stub(TerminalService, 'killTerminalInstance').returns();
    const mockedTerminalIdToDelete = '0987';
    const expectedActions = [
      {
        type: TerminalActionTypes.DELETE_TERMINAL_INSTANCE,
        terminalId: '0987',
      },
    ];
    const store = mockStore({
      TerminalsReducer: {
        terminals: [],
        selectedTerminal: '',
      },
    });
    store.dispatch(TerminalActions.deleteTerminalInstance(mockedTerminalIdToDelete));
    expect(store.getActions()).to.deep.equal(expectedActions);
  });

  it('should create an action to stop terminal instances', () => {
    sinonSandbox.stub(TerminalService, 'stopTerminalInstance').returns();
    const mockedTerminalIdToStop = '0987';
    TerminalActions.stopTerminalInstance(mockedTerminalIdToStop);
    expect(TerminalService.stopTerminalInstance.callCount).to.be.equal(1);
    expect(TerminalService.stopTerminalInstance.getCall(0).args[0]).to.be.equal('0987');
  });

  it('should create an action to select terminal instance', () => {
    sinonSandbox.stub(TerminalService, 'focusTerminalInstance').returns();
    const mockedTerminalIdToSelect = '0987';
    const expectedActions = [
      {
        type: TerminalActionTypes.SELECT_TERMINAL_INSTANCE,
        terminalId: '0987',
      },
    ];
    const store = mockStore({
      TerminalsReducer: {
        terminals: [],
        selectedTerminal: '',
      },
    });
    store.dispatch(TerminalActions.selectTerminalInstance(mockedTerminalIdToSelect));
    expect(store.getActions()).to.deep.equal(expectedActions);
    expect(TerminalService.focusTerminalInstance.callCount).to.be.equal(1);
    expect(TerminalService.focusTerminalInstance.getCall(0).args[0]).to.be.equal('0987');
  });

  it('should create an action to go to next terminal instance', () => {
    sinonSandbox.stub(TerminalService, 'focusTerminalInstance').returns();
    const expectedActions = [
      {
        type: TerminalActionTypes.GO_TO_NEXT_TERMINAL_INSTANCE,
      },
    ];
    const store = mockStore({
      TerminalsReducer: {
        terminals: [],
        selectedTerminal: '0987',
      },
    });
    store.dispatch(TerminalActions.goToNextTerminalInstance());
    expect(store.getActions()).to.deep.equal(expectedActions);
    expect(TerminalService.focusTerminalInstance.callCount).to.be.equal(1);
    expect(TerminalService.focusTerminalInstance.getCall(0).args[0]).to.be.equal('0987');
  });

  it('should create an action to go to previous terminal instance', () => {
    sinonSandbox.stub(TerminalService, 'focusTerminalInstance').returns();
    const expectedActions = [
      {
        type: TerminalActionTypes.GO_TO_PREVIOUS_TERMINAL_INSTANCE,
      },
    ];
    const store = mockStore({
      TerminalsReducer: {
        terminals: [],
        selectedTerminal: '0987',
      },
    });
    store.dispatch(TerminalActions.goToPreviousTerminalInstance());
    expect(store.getActions()).to.deep.equal(expectedActions);
    expect(TerminalService.focusTerminalInstance.callCount).to.be.equal(1);
    expect(TerminalService.focusTerminalInstance.getCall(0).args[0]).to.be.equal('0987');
  });
});
