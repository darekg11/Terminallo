import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import TerminalActions from '../../actions/TerminalActions';
import './Terminal.css';

class TerminalView extends Component {
  componentDidMount() {
    const { xTermInstance, virtualTerminalInstance, terminalStartupCommands } = this.props.terminal;
    xTermInstance.open(this.terminalInstanceDiv);
    xTermInstance.fit();
    xTermInstance.on('data', (data) => {
      virtualTerminalInstance.write(data);
    });
    virtualTerminalInstance.on('data', (data) => {
      xTermInstance.write(data);
    });
    // if (!initialized) {
    terminalStartupCommands.forEach((singleCommand) => {
      virtualTerminalInstance.write(`${singleCommand}\r`);
    });
    //   this.props.terminalFinishedInitialization(this.props.terminal);
    // }
  }

  componentWillUnmount() {
    const { xTermInstance, virtualTerminalInstance } = this.props.terminal;
    xTermInstance.removeAllListeners('data');
    virtualTerminalInstance.removeAllListeners('data');
  }

  render() {
    return (
      <div
        id="xterm_dynamic_id_uuid"
        ref={(c) => {
          this.terminalInstanceDiv = c;
        }}
      />
    );
  }
}

TerminalView.propTypes = {
  terminal: PropTypes.shape({
    xTermInstance: PropTypes.shape({
      open: PropTypes.func.isRequired,
      fit: PropTypes.func.isRequired,
      on: PropTypes.func.isRequired,
      write: PropTypes.func.isRequired,
    }).isRequired,
    virtualTerminalInstance: PropTypes.shape({
      on: PropTypes.func.isRequired,
      write: PropTypes.func.isRequired,
    }).isRequired,
    terminalStartupCommands: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  // terminalFinishedInitialization: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  selectedTerminal: state.TerminalsReducer.selectedTerminal,
});

// const mapDispatchToProps = dispatch => ({
//   terminalFinishedInitialization: terminal => dispatch(TerminalActions.terminalDoneInitialization(terminal)),
// });

export default connect(mapStateToProps, null)(TerminalView);
