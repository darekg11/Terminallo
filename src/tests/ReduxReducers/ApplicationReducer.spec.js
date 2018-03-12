import { expect } from 'chai';
import ApplicationReducer from '../../app/reducers/ApplicationStateReducer';
import ApplicationActionTypes from '../../app/actions/ApplicationActionTypes';

describe('Application reducer', () => {
  it('should return initial state', () => {
    const state = ApplicationReducer(undefined, {});
    const expectedInitialState = {
      terminalsFilePath: '',
    };

    expect(state).to.deep.equal(expectedInitialState);
  });

  it('should handle SET_TERMINALS_SOURCE_FILE_PATH - set path when path is provided in created action', () => {
    const state = ApplicationReducer(undefined, {
      type: ApplicationActionTypes.SET_TERMINALS_SOURCE_FILE_PATH,
      path: 'SomeMockPathValue',
    });
    const expectedState = {
      terminalsFilePath: 'SomeMockPathValue',
    };

    expect(state).to.deep.equal(expectedState);
  });

  it('should handle SET_TERMINALS_SOURCE_FILE_PATH - do not set path when path is missing in created action', () => {
    const state = ApplicationReducer(undefined, {
      type: ApplicationActionTypes.SET_TERMINALS_SOURCE_FILE_PATH,
    });
    const expectedState = {
      terminalsFilePath: '',
    };

    expect(state).to.deep.equal(expectedState);
  });
});
