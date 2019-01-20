import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Terminal.css';

class TerminalView extends Component {
  componentDidMount() {
    const { terminal } = this.props;
    const { xTermInstance } = terminal;
    xTermInstance.open(this.terminalInstanceDiv);
    this.resizeTerminalView();
    window.addEventListener('resize', this.resizeTerminalView);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeTerminalView);
  }

  resizeTerminalView = () => {
    const { terminal } = this.props;
    const { xTermInstance, virtualTerminalInstance } = terminal;
    const resizedDimensions = xTermInstance.proposeGeometry();
    xTermInstance.fit();
    virtualTerminalInstance.resize(resizedDimensions.cols, resizedDimensions.rows);
  };

  render() {
    return (
      <div
        id="xterm_dynamic_id_uuid"
        className="terminal-container"
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
      proposeGeometry: PropTypes.func.isRequired,
    }).isRequired,
    virtualTerminalInstance: PropTypes.shape({
      resize: PropTypes.func.isRequired,
    }),
  }).isRequired,
};

export default TerminalView;
