import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Tabs, { Tab } from 'material-ui/Tabs';
import ReloadIcon from 'material-ui-icons/Refresh';
import EditIcon from 'material-ui-icons/Edit';
import DeleteIcon from 'material-ui-icons/Delete';
import RightArrowIcon from 'material-ui-icons/ArrowForward';
import LeftArrowIcon from 'material-ui-icons/ArrowBack';
import IconButton from 'material-ui/IconButton';
import Tooltip from 'material-ui/Tooltip';
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
      scrollable
      scrollButtons="auto"
    >
      {props.terminals.map(singleTerminal => (
        <Tab key={singleTerminal.uuid} label={singleTerminal.terminalName} value={singleTerminal.uuid} />
      ))}
    </Tabs>
    <div className="terminal-area">
      <div className="terminal">
        {props.terminals
          .filter(singleTerminal => singleTerminal.uuid === props.selectedTerminal)
          .map(singleTerminal => <Terminal key={singleTerminal.uuid} terminal={singleTerminal} />)}
      </div>
      {props.selectedTerminal !== '' && (
        <div className="panel">
          <Tooltip id="tooltip-reload-terminal" title="Reload" placement="left">
            <IconButton aria-label="Reload" onClick={() => props.reloadTerminal(props.selectedTerminal)}>
              <ReloadIcon />
            </IconButton>
          </Tooltip>
          <Tooltip id="tooltip-edit-terminal" title="Edit" placement="left">
            <IconButton aria-label="Edit">
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip id="tooltip-delete-terminal" title="Delete" placement="left">
            <IconButton aria-label="Delete" onClick={() => props.deleteTerminal(props.selectedTerminal)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          <Tooltip id="tooltip-move-right-terminal" title="Move right" placement="left">
            <IconButton
              aria-label="Move right"
              onClick={() => props.moveTerminalRight(props.selectedTerminal)}
              disabled={props.terminals[props.terminals.length - 1].uuid === props.selectedTerminal}
            >
              <RightArrowIcon />
            </IconButton>
          </Tooltip>
          <Tooltip id="tooltip-move-left-terminal" title="Move left" placement="left">
            <IconButton aria-label="Move left">
              <LeftArrowIcon />
            </IconButton>
          </Tooltip>
        </div>
      )}
    </div>
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
  reloadTerminal: PropTypes.func.isRequired,
  deleteTerminal: PropTypes.func.isRequired,
  moveTerminalRight: PropTypes.func.isRequired,
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
  reloadTerminal: destinationTerminalUUID => dispatch(TerminalActions.reloadTerminalInstance(destinationTerminalUUID)),
  deleteTerminal: destinationTerminalUUID => dispatch(TerminalActions.deleteTerminalInstance(destinationTerminalUUID)),
  moveTerminalRight: destinationTerminalUUID =>
    dispatch(TerminalActions.moveRightTerminalInstance(destinationTerminalUUID)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TerminalTabs);
