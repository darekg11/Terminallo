import electron from 'electron';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import SettingsIcon from 'material-ui-icons/Settings';
import AddIcon from 'material-ui-icons/Add';
import ReorderIcon from 'material-ui-icons/Reorder';
import IconButton from 'material-ui/IconButton';
import SaveIcon from 'material-ui-icons/Save';
import SaveAsIcon from 'material-ui-icons/ContentCopy';
import ImportIcon from 'material-ui-icons/SystemUpdateAlt';
import Tooltip from 'material-ui/Tooltip';
import ApplicationActions from '../../actions/ApplicationActions';
import './AppBarMain.css';

const AppBarMain = props => (
  <div className="App-Bar-Main">
    <AppBar className="content" position="static" color="default">
      <Toolbar>
        <Tooltip id="tooltip-reorganize" title="Reorganize terminals">
          <IconButton aria-label="Reorganize terminals">
            <ReorderIcon />
          </IconButton>
        </Tooltip>
        <Tooltip id="tooltip-add-new" title="Add terminal">
          <IconButton aria-label="Add terminal" onClick={props.openAddNewTerminalWindow}>
            <AddIcon />
          </IconButton>
        </Tooltip>
        <Tooltip id="tooltip-import" title="Import terminals">
          <IconButton aria-label="Import terminals" onClick={props.importTerminals}>
            <ImportIcon />
          </IconButton>
        </Tooltip>
        <Tooltip id="tooltip-save" title="Save terminals">
          <IconButton aria-label="Save terminals">
            <SaveIcon />
          </IconButton>
        </Tooltip>
        <Tooltip id="tooltip-save-as" title="Save terminals as">
          <IconButton aria-label="Save terminals as" onClick={props.exportTerminals}>
            <SaveAsIcon />
          </IconButton>
        </Tooltip>
        <Tooltip id="tooltip-options" title="Options">
          <IconButton aria-label="Options">
            <SettingsIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  </div>
);

AppBarMain.propTypes = {
  openAddNewTerminalWindow: PropTypes.func.isRequired,
  exportTerminals: PropTypes.func.isRequired,
  importTerminals: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  openAddNewTerminalWindow: () => dispatch(ApplicationActions.openAddNewTerminalModalWindow()),
  exportTerminals: () => {
    const path = electron.remote.dialog.showSaveDialog({
      title: 'Enter file name for your export',
      defaultPath: 'terminals',
      filters: [
        {
          name: 'JSON File',
          extensions: ['json'],
        },
      ],
    });
    dispatch(ApplicationActions.exportTerminals(path));
  },
  importTerminals: () => {
    const filePath = electron.remote.dialog.showOpenDialog({
      title: 'Select file from which to import terminals',
      filters: [
        {
          name: 'JSON File',
          extensions: ['json'],
        },
      ],
      properties: ['openFile'],
    });
  },
});

export default connect(null, mapDispatchToProps)(AppBarMain);
