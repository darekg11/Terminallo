import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import { CircularProgress } from 'material-ui/Progress';
import Modal from 'material-ui/Modal';
import Button from 'material-ui/Button';
import SuccessIcon from 'material-ui-icons/SentimentVerySatisfied';
import ErrorIcon from 'material-ui-icons/SentimentVeryDissatisfied';
import Typography from 'material-ui/Typography';
import Divider from 'material-ui/Divider';
import SpinnerActions from '../../actions/SpinnerActions';

import './Spinner.css';

function getModalStyle() {
  return {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  };
}

const styles = theme => ({
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 60,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    paddingTop: theme.spacing.unit * 4,
    paddingLeft: theme.spacing.unit * 4,
    paddingRight: theme.spacing.unit * 4,
  },
  button: {
    margin: theme.spacing.unit,
  },
});

const Spinner = props => (
  <Modal
    aria-labelledby="Spinner"
    aria-describedby="Long running operation in progress"
    open={props.show}
    onClose={props.close}
  >
    <div style={getModalStyle()} className={props.classes.paper}>
      <div className="Spinner">
        {props.loading && (
          <div className="content">
            <CircularProgress size={50} />
            <Typography type="title" align="center" id="modal-title">
              {props.loadingMessage}
            </Typography>
          </div>
        )}
        {!props.loading &&
          props.showErrorMessage && (
            <div className="content">
              <ErrorIcon className="error-icon" />
              <Typography type="title" align="center" id="modal-title">
                {props.errorMessage}
              </Typography>
            </div>
          )}
        {!props.loading &&
          props.showSuccessMessage && (
            <div className="content">
              <SuccessIcon className="success-icon" />
              <Typography type="title" align="center" id="modal-title">
                {props.successMessage}
              </Typography>
            </div>
          )}
        {!props.loading && (
          <div className="content">
            <Divider className="divider" />
            <Button className={props.classes.button} raised color="primary" onClick={props.close}>
              OK
            </Button>
          </div>
        )}
      </div>
    </div>
  </Modal>
);

Spinner.propTypes = {
  show: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  showSuccessMessage: PropTypes.bool.isRequired,
  showErrorMessage: PropTypes.bool.isRequired,
  loadingMessage: PropTypes.string.isRequired,
  successMessage: PropTypes.string.isRequired,
  errorMessage: PropTypes.string.isRequired,
  close: PropTypes.func.isRequired,
  classes: PropTypes.shape({
    paper: PropTypes.string,
    button: PropTypes.string,
  }).isRequired,
};

const mapStateToProps = state => ({
  show: state.SpinnerReducer.show,
  loading: state.SpinnerReducer.loading,
  showSuccessMessage: state.SpinnerReducer.showSuccessMessage,
  showErrorMessage: state.SpinnerReducer.showErrorMessage,
  loadingMessage: state.SpinnerReducer.loadingMessage,
  successMessage: state.SpinnerReducer.successMessage,
  errorMessage: state.SpinnerReducer.errorMessage,
});

const mapDispatchToProps = dispatch => ({
  close: () => dispatch(SpinnerActions.hideSpinner()),
});

const styledComponent = withStyles(styles)(Spinner);
export default connect(mapStateToProps, mapDispatchToProps)(styledComponent);