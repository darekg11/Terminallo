import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Tabs, { Tab } from 'material-ui/Tabs';
import TerminalActions from '../../actions/TerminalActions';
import Terminal from '../Terminal/Terminal';
import './TerminalTabs.css';

const TerminalTabs = props => (
  <Paper className="Terminal-Tabs">
    <Tabs
      value={props.selectedTerminal === '' ? false : props.selectedTerminal}
      onChange={(event, value) => props.selectTerminal(value)}
      indicatorColor="primary"
      textColor="primary"
    >
      {props.terminals.map(singleTerminal => (
        <Tab key={singleTerminal.uuid} label={singleTerminal.terminalName} value={singleTerminal.uuid} />
      ))}
    </Tabs>
    {props.terminals
      .filter(singleTerminal => singleTerminal.uuid === props.selectedTerminal)
      .map(singleTerminal => <Terminal key={singleTerminal.uuid} terminal={singleTerminal} />)}
  </Paper>
);

TerminalTabs.propTypes = {
  terminals: PropTypes.arrayOf(PropTypes.shape({
    terminalName: PropTypes.string.isRequired,
    uuid: PropTypes.string.isRequired,
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
  })),
  selectedTerminal: PropTypes.string,
  selectTerminal: PropTypes.func.isRequired,
};

TerminalTabs.defaultProps = {
  terminals: [],
  selectedTerminal: {},
};

const mapStateToProps = state => ({
  terminals: state.TerminalsReducer.terminals,
  selectedTerminal: state.TerminalsReducer.selectedTerminal,
});

const mapDispatchToProps = dispatch => ({
  selectTerminal: destinationTerminalUUID => dispatch(TerminalActions.selectTerminalInstance(destinationTerminalUUID)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TerminalTabs);
