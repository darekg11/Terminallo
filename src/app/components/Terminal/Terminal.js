import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Terminal.css';

class TerminalView extends Component {
  componentDidMount() {
    const { xTermInstance } = this.props.terminal;
    xTermInstance.open(this.terminalInstanceDiv);
    this.resizeTerminalView();
    window.addEventListener('resize', this.resizeTerminalView);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeTerminalView);
  }

  resizeTerminalView = () => {
    const { xTermInstance, virtualTerminalInstance } = this.props.terminal;
    const resizedDimensions = xTermInstance.proposeGeometry();
    xTermInstance.fit();
    virtualTerminalInstance.resize(resizedDimensions.cols, resizedDimensions.rows);
  };

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
    }).isRequired,
    virtualTerminalInstance: PropTypes.shape({
      resize: PropTypes.func.isRequired,
    }),
  }).isRequired,
};

export default TerminalView;
