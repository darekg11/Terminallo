import SpinnerActionTypes from './SpinnerActionTypes';

const showSpinner = loadingMessage => ({
  type: SpinnerActionTypes.SPINNER_SHOW,
  loadingMessage,
});

const showSpinnerSuccess = successMessage => ({
  type: SpinnerActionTypes.SPINNER_LOADING_SUCCESS,
  successMessage,
});

const showSpinnerError = errorMessage => ({
  type: SpinnerActionTypes.SPINNER_LOADING_ERROR,
  errorMessage,
});

const hideSpinner = () => ({
  type: SpinnerActionTypes.SPINNER_HIDE,
});

export default {
  hideSpinner,
  showSpinner,
  showSpinnerSuccess,
  showSpinnerError,
};
