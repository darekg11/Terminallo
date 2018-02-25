import { expect } from 'chai';
import SpinnerReducer from '../../app/reducers/SpinnerReducer';
import SpinnerActionTypes from '../../app/actions/SpinnerActionTypes';

describe('Spinner reducer', () => {
  it('should return initial state', () => {
    const state = SpinnerReducer(undefined, {});
    const expectedInitialState = {
      show: false,
      loading: true,
      showSuccessMessage: false,
      showErrorMessage: false,
      loadingMessage: '',
      successMessage: '',
      errorMessage: '',
    };

    expect(state).to.deep.equal(expectedInitialState);
  });

  it('should handle SPINNER_SHOW', () => {
    const state = SpinnerReducer(undefined, {
      type: SpinnerActionTypes.SPINNER_SHOW,
      loadingMessage: 'Loading...',
    });
    const expectedState = {
      show: true,
      loading: true,
      showSuccessMessage: false,
      showErrorMessage: false,
      loadingMessage: 'Loading...',
      successMessage: '',
      errorMessage: '',
    };

    expect(state).to.deep.equal(expectedState);
  });

  it('should handle SPINNER_LOADING_SUCCESS', () => {
    const state = SpinnerReducer(undefined, {
      type: SpinnerActionTypes.SPINNER_SHOW,
      loadingMessage: 'Loading...',
    });
    const finalState = SpinnerReducer(state, {
      type: SpinnerActionTypes.SPINNER_LOADING_SUCCESS,
      successMessage: 'Successo!',
    });
    const expectedState = {
      show: true,
      loading: false,
      showSuccessMessage: true,
      showErrorMessage: false,
      loadingMessage: '',
      successMessage: 'Successo!',
      errorMessage: '',
    };

    expect(finalState).to.deep.equal(expectedState);
  });

  it('should handle SPINNER_LOADING_ERROR', () => {
    const state = SpinnerReducer(undefined, {
      type: SpinnerActionTypes.SPINNER_SHOW,
      loadingMessage: 'Loading...',
    });
    const finalState = SpinnerReducer(state, {
      type: SpinnerActionTypes.SPINNER_LOADING_ERROR,
      errorMessage: 'Nasty error!',
    });
    const expectedState = {
      show: true,
      loading: false,
      showSuccessMessage: false,
      showErrorMessage: true,
      loadingMessage: '',
      successMessage: '',
      errorMessage: 'Nasty error!',
    };

    expect(finalState).to.deep.equal(expectedState);
  });

  it('should handle SPINNER_LOADING_ERROR into SPINNER_LOADING_SUCCESS transition', () => {
    const state = SpinnerReducer(undefined, {
      type: SpinnerActionTypes.SPINNER_SHOW,
      loadingMessage: 'Loading...',
    });
    const errorState = SpinnerReducer(state, {
      type: SpinnerActionTypes.SPINNER_LOADING_ERROR,
      errorMessage: 'Nasty error!',
    });
    const finalState = SpinnerReducer(errorState, {
      type: SpinnerActionTypes.SPINNER_LOADING_SUCCESS,
      successMessage: 'Yay, worked',
    });
    const expectedState = {
      show: true,
      loading: false,
      showSuccessMessage: true,
      showErrorMessage: false,
      loadingMessage: '',
      successMessage: 'Yay, worked',
      errorMessage: '',
    };

    expect(finalState).to.deep.equal(expectedState);
  });

  it('should handle SPINNER_LOADING_SUCCESS into SPINNER_LOADING_ERROR transition', () => {
    const state = SpinnerReducer(undefined, {
      type: SpinnerActionTypes.SPINNER_SHOW,
      loadingMessage: 'Loading...',
    });
    const successState = SpinnerReducer(state, {
      type: SpinnerActionTypes.SPINNER_LOADING_SUCCESS,
      successMessage: 'Awesome!',
    });
    const finalState = SpinnerReducer(successState, {
      type: SpinnerActionTypes.SPINNER_LOADING_ERROR,
      errorMessage: 'Bummer',
    });
    const expectedState = {
      show: true,
      loading: false,
      showSuccessMessage: false,
      showErrorMessage: true,
      loadingMessage: '',
      successMessage: '',
      errorMessage: 'Bummer',
    };

    expect(finalState).to.deep.equal(expectedState);
  });

  it('should handle SPINNER_HIDE after multiple states', () => {
    const state = SpinnerReducer(undefined, {
      type: SpinnerActionTypes.SPINNER_SHOW,
      loadingMessage: 'Loading...',
    });
    const successState = SpinnerReducer(state, {
      type: SpinnerActionTypes.SPINNER_LOADING_SUCCESS,
      successMessage: 'Awesome!',
    });
    const errorState = SpinnerReducer(successState, {
      type: SpinnerActionTypes.SPINNER_LOADING_ERROR,
      errorMessage: 'Bummer',
    });
    const finalState = SpinnerReducer(errorState, {
      type: SpinnerActionTypes.SPINNER_HIDE,
    });
    const expectedState = {
      show: false,
      loading: true,
      showSuccessMessage: false,
      showErrorMessage: false,
      loadingMessage: '',
      successMessage: '',
      errorMessage: '',
    };

    expect(finalState).to.deep.equal(expectedState);
  });
});
