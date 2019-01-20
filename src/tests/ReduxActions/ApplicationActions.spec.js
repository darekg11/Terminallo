import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import sinon from 'sinon';
import * as TerminalService from '../../app/services/TerminalService';
import * as FileService from '../../app/services/FileService';
import ApplicationActionTypes from '../../app/actions/ApplicationActionTypes';
import ApplicationActions from '../../app/actions/ApplicationActions';
import SpinnerActionTypes from '../../app/actions/SpinnerActionTypes';
import TerminalActionTypes from '../../app/actions/TerminalActionTypes';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
let sinonSandbox = null;

describe('actions', () => {
  beforeEach(() => {
    sinonSandbox = sinon.createSandbox();
  });
  afterEach(() => {
    sinonSandbox.restore();
  });

  it('should create an action to change terminals source file path', () => {
    const expectedAction = {
      type: ApplicationActionTypes.SET_TERMINALS_SOURCE_FILE_PATH,
      path: 'SomeMockPath',
    };
    expect(ApplicationActions.setTerminalsSourcePath('SomeMockPath')).to.deep.equal(expectedAction);
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
        type: 'BATCHING_REDUCER.BATCH',
        meta: { batch: true },
        payload: [
          {
            type: SpinnerActionTypes.SPINNER_LOADING_SUCCESS,
            successMessage: 'Terminals exported successfully.',
          },
          {
            type: ApplicationActionTypes.SET_TERMINALS_SOURCE_FILE_PATH,
            path: 'D:TestPath',
          },
        ],
      },
    ];
    const store = mockStore({
      TerminalsReducer: {
        terminals: [],
        terminalsFilePath: '',
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
        terminalsFilePath: '',
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
        terminalsFilePath: '',
      },
    });
    return store.dispatch(ApplicationActions.exportTerminals('')).then(() => {
      expect(store.getActions()).to.deep.equal(expectedActions);
      done();
    });
  });

  it('should create action to show spinner loading and spinner error when no path to import was passed', (done) => {
    sinonSandbox.stub(FileService, 'loadJsonFromFile').returns({ terminals: [] });
    sinonSandbox.stub(TerminalService, 'importTerminalsToObject').returns({ terminals: [] });
    const expectedActions = [
      {
        type: SpinnerActionTypes.SPINNER_SHOW,
        loadingMessage: 'Importing terminals... Please wait',
      },
      {
        type: SpinnerActionTypes.SPINNER_LOADING_ERROR,
        errorMessage: 'Missing import file path',
      },
    ];
    const store = mockStore({
      terminals: [],
      terminalsFilePath: '',
    });
    return store.dispatch(ApplicationActions.importTerminals('')).then(() => {
      expect(store.getActions()).to.deep.equal(expectedActions);
      done();
    });
  });

  it('should create action to show spinner loading and spinner success when import was success', (done) => {
    const sampleTerminalInstances = {
      terminals: [
        {
          name: 'test1',
          uuid: '1234',
        },
        {
          name: 'test2',
          uuid: '45678',
        },
      ],
    };
    sinonSandbox.stub(FileService, 'loadJsonFromFile').returns({ terminals: [] });
    sinonSandbox.stub(TerminalService, 'importTerminalsToObject').returns(sampleTerminalInstances);
    const expectedActions = [
      {
        type: SpinnerActionTypes.SPINNER_SHOW,
        loadingMessage: 'Importing terminals... Please wait',
      },
      {
        type: 'BATCHING_REDUCER.BATCH',
        meta: { batch: true },
        payload: [
          {
            type: TerminalActionTypes.IMPORT_TERMINALS,
            terminals: [
              {
                name: 'test1',
                uuid: '1234',
              },
              {
                name: 'test2',
                uuid: '45678',
              },
            ],
          },
          {
            type: SpinnerActionTypes.SPINNER_LOADING_SUCCESS,
            successMessage: 'Terminals imported successfully.',
          },
          {
            type: ApplicationActionTypes.SET_TERMINALS_SOURCE_FILE_PATH,
            path: 'D:TestPath',
          },
        ],
      },
    ];
    const store = mockStore({
      TerminalsReducer: {
        terminals: [],
        terminalsFilePath: '',
      },
    });
    return store.dispatch(ApplicationActions.importTerminals('D:TestPath')).then(() => {
      expect(store.getActions()).to.deep.equal(expectedActions);
      done();
    });
  });

  it('should create action to show spinner loading and spinner error when import failed because of FileService', (done) => {
    sinonSandbox.stub(FileService, 'loadJsonFromFile').throws({
      message: 'Mocked error!',
    });
    sinonSandbox.stub(TerminalService, 'importTerminalsToObject').returns({ terminals: [] });
    const expectedActions = [
      {
        type: SpinnerActionTypes.SPINNER_SHOW,
        loadingMessage: 'Importing terminals... Please wait',
      },
      {
        type: SpinnerActionTypes.SPINNER_LOADING_ERROR,
        errorMessage: 'Could not import terminals :( Error: Mocked error!',
      },
    ];
    const store = mockStore({
      terminals: [],
      terminalsFilePath: '',
    });
    return store.dispatch(ApplicationActions.importTerminals('SomePath')).then(() => {
      expect(store.getActions()).to.deep.equal(expectedActions);
      done();
    });
  });

  it('should create action to show spinner loading and spinner error when import failed because of TerminalService', (done) => {
    sinonSandbox.stub(FileService, 'loadJsonFromFile').returns({ terminal: [] });
    sinonSandbox.stub(TerminalService, 'importTerminalsToObject').throws({
      message: 'Mocked error!',
    });
    const expectedActions = [
      {
        type: SpinnerActionTypes.SPINNER_SHOW,
        loadingMessage: 'Importing terminals... Please wait',
      },
      {
        type: SpinnerActionTypes.SPINNER_LOADING_ERROR,
        errorMessage: 'Could not import terminals :( Error: Mocked error!',
      },
    ];
    const store = mockStore({
      terminals: [],
      terminalsFilePath: '',
    });
    return store.dispatch(ApplicationActions.importTerminals('SomePath')).then(() => {
      expect(store.getActions()).to.deep.equal(expectedActions);
      done();
    });
  });
});
