import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as TerminalService from '../../services/TerminalService';
import './Terminal.css';

class TerminalView extends Component {
  componentDidMount() {
    const { terminal } = this.props;
    TerminalService.hookTerminalToRenderer(terminal.id, this.terminalInstanceDiv);
    window.addEventListener('resize', this.resizeTerminalView);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeTerminalView);
  }

  resizeTerminalView = () => {
    const { terminal } = this.props;
    TerminalService.resizeTerminal(terminal.id);
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
    id: PropTypes.string.isRequired,
  }).isRequired,
};

export default TerminalView;
