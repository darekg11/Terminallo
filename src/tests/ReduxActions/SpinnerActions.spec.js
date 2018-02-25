import { expect } from 'chai';
import SpinnerActionTypes from '../../app/actions/SpinnerActionTypes';
import SpinnerActions from '../../app/actions/SpinnerActions';

describe('actions', () => {
  it('should create an action to show spinner', () => {
    const expectedAction = {
      type: SpinnerActionTypes.SPINNER_SHOW,
      loadingMessage: 'Test loading message',
    };
    expect(SpinnerActions.showSpinner('Test loading message')).to.deep.equal(expectedAction);
  });

  it('should create an action to hide spinner', () => {
    const expectedAction = {
      type: SpinnerActionTypes.SPINNER_HIDE,
    };
    expect(SpinnerActions.hideSpinner()).to.deep.equal(expectedAction);
  });

  it('should create an action to show spinner success message', () => {
    const expectedAction = {
      type: SpinnerActionTypes.SPINNER_LOADING_SUCCESS,
      successMessage: 'Test success message',
    };
    expect(SpinnerActions.showSpinnerSuccess('Test success message')).to.deep.equal(expectedAction);
  });

  it('should create an action to show spinner error message', () => {
    const expectedAction = {
      type: SpinnerActionTypes.SPINNER_LOADING_ERROR,
      errorMessage: 'Test error message',
    };
    expect(SpinnerActions.showSpinnerError('Test error message')).to.deep.equal(expectedAction);
  });
});
