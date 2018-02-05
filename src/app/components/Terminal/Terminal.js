import React, { Component } from 'react';
import PropTypes from 'prop-types';
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

    terminalStartupCommands.forEach((singleCommand) => {
      virtualTerminalInstance.write(`${singleCommand}\r`);
    });
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
};

export default TerminalView;
