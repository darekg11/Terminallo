import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import sinon from 'sinon';
import * as TerminalService from '../../app/services/TerminalService';
import * as FileService from '../../app/services/FileService';
import ApplicationActionTypes from '../../app/actions/ApplicationActionTypes';
import ApplicationActions from '../../app/actions/ApplicationActions';
import SpinnerActionTypes from '../../app/actions/SpinnerActionTypes';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
let sinonSandbox = null;

describe('actions', () => {
  beforeEach(() => {
    sinonSandbox = sinon.sandbox.create();
  });
  afterEach(() => {
    sinonSandbox.restore();
  });

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

  it('should create action to show spinner loading and spinner success when export was success', (done) => {
    sinonSandbox.stub(TerminalService, 'exportTermninalsToObject').returns({ terminals: [] });
    sinonSandbox.stub(FileService, 'saveJsonToFile').returns({});
    const expectedActions = [
      {
        type: SpinnerActionTypes.SPINNER_SHOW,
        loadingMessage: 'Exporting terminals... Please wait',
      },
      {
        type: SpinnerActionTypes.SPINNER_LOADING_SUCCESS,
        successMessage: 'Terminals exported successfully.',
      },
    ];
    const store = mockStore({
      TerminalsReducer: {
        terminals: [],
      },
    });
    return store.dispatch(ApplicationActions.exportTerminals('D:TestPath')).then(() => {
      expect(store.getActions()).to.deep.equal(expectedActions);
      done();
    });
  });

  it('should create action to show spinner loading and spinner error when export of terminals was failure', (done) => {
    sinonSandbox.stub(TerminalService, 'exportTermninalsToObject').throws({
      message: 'Test Exception message',
    });
    const expectedActions = [
      {
        type: SpinnerActionTypes.SPINNER_SHOW,
        loadingMessage: 'Exporting terminals... Please wait',
      },
      {
        type: SpinnerActionTypes.SPINNER_LOADING_ERROR,
        errorMessage: 'Could not export terminals :( Error: Test Exception message',
      },
    ];
    const store = mockStore({
      TerminalsReducer: {
        terminals: [],
      },
    });
    return store.dispatch(ApplicationActions.exportTerminals('D:TestPath')).then(() => {
      expect(store.getActions()).to.deep.equal(expectedActions);
      done();
    });
  });

  it('should create action to show spinner loading and spinner error when no path to export was passed', (done) => {
    sinonSandbox.stub(TerminalService, 'exportTermninalsToObject').returns({ terminals: [] });
    const expectedActions = [
      {
        type: SpinnerActionTypes.SPINNER_SHOW,
        loadingMessage: 'Exporting terminals... Please wait',
      },
      {
        type: SpinnerActionTypes.SPINNER_LOADING_ERROR,
        errorMessage: 'Missing save path',
      },
    ];
    const store = mockStore({
      TerminalsReducer: {
        terminals: [],
      },
    });
    return store.dispatch(ApplicationActions.exportTerminals('')).then(() => {
      expect(store.getActions()).to.deep.equal(expectedActions);
      done();
    });
  });
});
