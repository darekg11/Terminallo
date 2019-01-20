import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import SaveIcon from '@material-ui/icons/Save';
import SaveAsIcon from '@material-ui/icons/FileCopy';
import ImportIcon from '@material-ui/icons/FolderOpen';
import Tooltip from '@material-ui/core/Tooltip';
import AddEditTerminalWindowActions from '../../actions/TerminalAddEditWindowActions';
import ApplicationActions from '../../actions/ApplicationActions';
import * as FileService from '../../services/FileService';
import './AppBarMain.css';

const AppBarMain = ({
  openAddNewTerminalWindow,
  importTerminals,
  exportTerminals,
  saveTerminals,
  terminalsSavePath,
}) => (
  <div className="App-Bar-Main">
    <AppBar className="content" position="static" color="default">
      <Toolbar>
        <Tooltip id="tooltip-add-new" title="Add terminal">
          <IconButton aria-label="Add terminal" onClick={openAddNewTerminalWindow}>
            <AddIcon />
          </IconButton>
        </Tooltip>
        <Tooltip id="tooltip-import" title="Import terminals">
          <IconButton aria-label="Import terminals" onClick={importTerminals}>
            <ImportIcon />
          </IconButton>
        </Tooltip>
        <Tooltip id="tooltip-save" title="Save terminals (CTRL+S)">
          <IconButton
            aria-label="Save terminals"
            onClick={() => (terminalsSavePath === '' ? exportTerminals() : saveTerminals(terminalsSavePath))}
          >
            <SaveIcon />
          </IconButton>
        </Tooltip>
        <Tooltip id="tooltip-save-as" title="Save terminals as">
          <IconButton aria-label="Save terminals as" onClick={exportTerminals}>
            <SaveAsIcon />
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
  saveTerminals: PropTypes.func.isRequired,
  terminalsSavePath: PropTypes.string.isRequired,
};

const mapDispatchToProps = dispatch => ({
  openAddNewTerminalWindow: () => dispatch(AddEditTerminalWindowActions.showAddNewTerminalWindow()),
  exportTerminals: () => {
    const windowFilters = [
      {
        name: 'JSON File',
        extensions: ['json'],
      },
    ];
    const path = FileService.showSaveFileDialog('Enter file name for your export', 'terminals', windowFilters);
    if (path) {
      dispatch(ApplicationActions.exportTerminals(path));
    }
  },
  importTerminals: () => {
    const windowFilters = [
      {
        name: 'JSON File',
        extensions: ['json'],
      },
    ];
    const filePath = FileService.showOpenFileDialog('Select file from which to import terminals', windowFilters);
    if (filePath && filePath[0]) {
      dispatch(ApplicationActions.importTerminals(filePath[0]));
    }
  },
  saveTerminals: (path) => {
    if (path) {
      dispatch(ApplicationActions.exportTerminals(path));
    }
  },
});

const mapStateToProps = state => ({
  terminalsSavePath: state.ApplicationStateReducer.terminalsFilePath,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AppBarMain);
