import React from 'react';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import SettingsIcon from 'material-ui-icons/Settings';
import AddIcon from 'material-ui-icons/Add';
import ReorderIcon from 'material-ui-icons/Reorder';
import IconButton from 'material-ui/IconButton';
import Tooltip from 'material-ui/Tooltip';
import './AppBarMain.css';

function AppBarMain() {
  return (
    <div className="App-Bar-Main">
      <AppBar className="content" position="static" color="default">
        <Toolbar>
          <Tooltip id="tooltip-reorganize" title="Reorganize terminals">
            <IconButton aria-label="Reorganize terminals">
              <ReorderIcon />
            </IconButton>
          </Tooltip>
          <Tooltip id="tooltip-add-new" title="Add terminal">
            <IconButton aria-label="Add terminal">
              <AddIcon />
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
}
export default AppBarMain;
