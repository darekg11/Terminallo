import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Terminal.css';

class TerminalView extends Component {
  componentDidMount() {
    const { xTermInstance } = this.props.terminal;
    xTermInstance.open(this.terminalInstanceDiv);
    xTermInstance.fit();
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
    }).isRequired,
  }).isRequired,
};

export default TerminalView;
