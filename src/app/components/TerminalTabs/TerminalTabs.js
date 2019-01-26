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
          <Tab key={singleTerminal.id} label={singleTerminal.terminalName} value={singleTerminal.id} />
        ))}
      </Tabs>
    )}
    <div className="terminal-area">
      <div className="terminal">
        {terminals
          .filter(singleTerminal => singleTerminal.id === selectedTerminal)
          .map(singleTerminal => (
            <Terminal key={singleTerminal.id} terminal={singleTerminal} />
          ))}
      </div>
      {selectedTerminal !== '' && (
        <div className="panel">
          <Tooltip id="tooltip-stop-terminal" title="Stop (ALT + p)" placement="left">
            <div>
              <IconButton aria-label="Stop" onClick={() => stopTerminal(selectedTerminal)}>
                <PauseIcon />
              </IconButton>
            </div>
          </Tooltip>
          <Tooltip id="tooltip-reload-terminal" title="Reload (ALT + p)" placement="left">
            <div>
              <IconButton aria-label="Reload" onClick={() => reloadTerminal(selectedTerminal)}>
                <ReloadIcon />
              </IconButton>
            </div>
          </Tooltip>
          <Tooltip id="tooltip-edit-terminal" title="Edit (ALT + e)" placement="left">
            <div>
              <IconButton
                aria-label="Edit"
                onClick={() => editTerminal(terminals.find(singleTerminal => singleTerminal.id === selectedTerminal))}
              >
                <EditIcon />
              </IconButton>
            </div>
          </Tooltip>
          <Tooltip id="tooltip-delete-terminal" title="Delete (ALT + d)" placement="left">
            <div>
              <IconButton aria-label="Delete" onClick={() => deleteTerminal(selectedTerminal)}>
                <DeleteIcon />
              </IconButton>
            </div>
          </Tooltip>
          <Tooltip id="tooltip-move-right-terminal" title="Move right (ALT + ->)" placement="left">
            <div>
              <IconButton
                aria-label="Move right"
                onClick={() => moveTerminalRight(selectedTerminal)}
                disabled={terminals[terminals.length - 1].id === selectedTerminal}
              >
                <RightArrowIcon />
              </IconButton>
            </div>
          </Tooltip>
          <Tooltip id="tooltip-move-left-terminal" title="Move left (ALT + <-)" placement="left">
            <div>
              <IconButton
                aria-label="Move left"
                onClick={() => moveTerminalLeft(selectedTerminal)}
                disabled={terminals[0].id === selectedTerminal}
              >
                <LeftArrowIcon />
              </IconButton>
            </div>
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
      id: PropTypes.string.isRequired,
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
  selectedTerminal: '',
};

const mapStateToProps = state => ({
  terminals: state.TerminalsReducer.terminals,
  selectedTerminal: state.TerminalsReducer.selectedTerminal,
});

const mapDispatchToProps = dispatch => ({
  selectTerminal: terminalId => dispatch(TerminalActions.selectTerminalInstance(terminalId)),
  reloadTerminal: terminalId => dispatch(TerminalActions.reloadTerminalInstance(terminalId)),
  deleteTerminal: terminalId => dispatch(TerminalActions.deleteTerminalInstance(terminalId)),
  moveTerminalRight: terminalId => dispatch(TerminalActions.moveRightTerminalInstance(terminalId)),
  moveTerminalLeft: terminalId => dispatch(TerminalActions.moveLeftTerminalInstance(terminalId)),
  stopTerminal: terminalId => TerminalActions.stopTerminalInstance(terminalId),
  editTerminal: terminalInstance => dispatch(AddEditTerminalWindowActions.showEditExistingTerminalWindow(terminalInstance)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TerminalTabs);
