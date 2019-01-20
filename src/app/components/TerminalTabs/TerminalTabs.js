import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PauseIcon from '@material-ui/icons/Pause';
import ReloadIcon from '@material-ui/icons/Refresh';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import RightArrowIcon from '@material-ui/icons/ArrowForward';
import LeftArrowIcon from '@material-ui/icons/ArrowBack';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import AddEditTerminalWindowActions from '../../actions/TerminalAddEditWindowActions';
import TerminalActions from '../../actions/TerminalActions';
import Terminal from '../Terminal/Terminal';
import './TerminalTabs.css';

const TerminalTabs = ({
  terminals,
  selectedTerminal,
  selectTerminal,
  deleteTerminal,
  editTerminal,
  moveTerminalLeft,
  moveTerminalRight,
  reloadTerminal,
  stopTerminal,
}) => (
  <Paper className="Terminal-Tabs">
    {terminals.length > 0 && (
      <Tabs
        value={selectedTerminal === '' ? false : selectedTerminal}
        onChange={(event, value) => selectTerminal(value)}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
      >
        {terminals.map(singleTerminal => (
          <Tab key={singleTerminal.uuid} label={singleTerminal.terminalName} value={singleTerminal.uuid} />
        ))}
      </Tabs>
    )}
    <div className="terminal-area">
      <div className="terminal">
        {terminals
          .filter(singleTerminal => singleTerminal.uuid === selectedTerminal)
          .map(singleTerminal => (
            <Terminal key={singleTerminal.uuid} terminal={singleTerminal} />
          ))}
      </div>
      {selectedTerminal !== '' && (
        <div className="panel">
          <Tooltip id="tooltip-stop-terminal" title="Stop (CTRL + P)" placement="left">
            <IconButton aria-label="Stop" onClick={() => stopTerminal(selectedTerminal)}>
              <PauseIcon />
            </IconButton>
          </Tooltip>
          <Tooltip id="tooltip-reload-terminal" title="Reload (CTRL + R)" placement="left">
            <IconButton aria-label="Reload" onClick={() => reloadTerminal(selectedTerminal)}>
              <ReloadIcon />
            </IconButton>
          </Tooltip>
          <Tooltip id="tooltip-edit-terminal" title="Edit (CTRL + E)" placement="left">
            <IconButton
              aria-label="Edit"
              onClick={() => editTerminal(terminals.find(singleTerminal => singleTerminal.uuid === selectedTerminal))}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip id="tooltip-delete-terminal" title="Delete (CTRL + D)" placement="left">
            <IconButton aria-label="Delete" onClick={() => deleteTerminal(selectedTerminal)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          <Tooltip id="tooltip-move-right-terminal" title="Move right (CTRL + ->)" placement="left">
            <IconButton
              aria-label="Move right"
              onClick={() => moveTerminalRight(selectedTerminal)}
              disabled={terminals[terminals.length - 1].uuid === selectedTerminal}
            >
              <RightArrowIcon />
            </IconButton>
          </Tooltip>
          <Tooltip id="tooltip-move-left-terminal" title="Move left (CTRL + <-)" placement="left">
            <IconButton
              aria-label="Move left"
              onClick={() => moveTerminalLeft(selectedTerminal)}
              disabled={terminals[0].uuid === selectedTerminal}
            >
              <LeftArrowIcon />
            </IconButton>
          </Tooltip>
        </div>
      )}
    </div>
  </Paper>
);

TerminalTabs.propTypes = {
  terminals: PropTypes.arrayOf(
    PropTypes.shape({
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
    }),
  ),
  selectedTerminal: PropTypes.string,
  selectTerminal: PropTypes.func.isRequired,
  reloadTerminal: PropTypes.func.isRequired,
  deleteTerminal: PropTypes.func.isRequired,
  moveTerminalRight: PropTypes.func.isRequired,
  moveTerminalLeft: PropTypes.func.isRequired,
  stopTerminal: PropTypes.func.isRequired,
  editTerminal: PropTypes.func.isRequired,
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
  selectTerminal: terminalUUID => dispatch(TerminalActions.selectTerminalInstance(terminalUUID)),
  reloadTerminal: terminalUUID => dispatch(TerminalActions.reloadTerminalInstance(terminalUUID)),
  deleteTerminal: terminalUUID => dispatch(TerminalActions.deleteTerminalInstance(terminalUUID)),
  moveTerminalRight: terminalUUID => dispatch(TerminalActions.moveRightTerminalInstance(terminalUUID)),
  moveTerminalLeft: terminalUUID => dispatch(TerminalActions.moveLeftTerminalInstance(terminalUUID)),
  stopTerminal: terminalUUID => dispatch(TerminalActions.stopTerminalInstance(terminalUUID)),
  editTerminal: terminalInstance => dispatch(AddEditTerminalWindowActions.showEditExistingTerminalWindow(terminalInstance)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TerminalTabs);
