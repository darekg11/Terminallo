import SpinnerActionTypes from '../actions/SpinnerActionTypes';

const initialState = {
  show: false,
  loading: true,
  showSuccessMessage: false,
  showErrorMessage: false,
  loadingMessage: '',
  successMessage: '',
  errorMessage: '',
};

export default function spinnerState(state = initialState, action) {
  switch (action.type) {
    case SpinnerActionTypes.SPINNER_SHOW:
      return {
        ...state,
        show: true,
        loading: true,
        loadingMessage: action.loadingMessage,
        showSuccessMessage: false,
        showErrorMessage: false,
      };
    case SpinnerActionTypes.SPINNER_LOADING_SUCCESS: {
      return {
        ...state,
        loading: false,
        showSuccessMessage: true,
        showErrorMessage: false,
        successMessage: action.successMessage,
      };
    }
    case SpinnerActionTypes.SPINNER_LOADING_ERROR: {
      return {
        ...state,
        loading: false,
        showSuccessMessage: false,
        showErrorMessage: true,
        errorMessage: action.errorMessage,
      };
    }
    case SpinnerActionTypes.SPINNER_HIDE: {
      return {
        ...initialState,
      };
    }
    default:
      return state;
  }
}
