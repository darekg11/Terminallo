import electron from 'electron';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { batchActions } from 'redux-batched-actions';
import os from 'os';
import { forIn } from 'lodash';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import Modal from 'material-ui/Modal';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import TextField from 'material-ui/TextField';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Select from 'material-ui/Select';
import FolderOpenIcon from 'material-ui-icons/FolderOpen';
import AddIcon from 'material-ui-icons/Add';
import IconButton from 'material-ui/IconButton';
import Tooltip from 'material-ui/Tooltip';
import TerminalAddEditWindowActions from '../../actions/TerminalAddEditWindowActions';
import TerminalActions from '../../actions/TerminalActions';
import TerminalTypes from '../../enums/TerminalTypes';
import './AddEditTerminalWindow.css';

const osType = os.platform() === 'win32' ? 'windows' : 'unix';

function getModalStyle() {
  return {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  };
}

const styles = theme => ({
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 60,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
  },
  button: {
    margin: theme.spacing.unit,
    alignSelf: 'flex-end',
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  formControl: {
    margin: theme.spacing.unit,
  },
});

class AddEditTerminalWindow extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      terminalType: props.terminalType,
      terminalName: props.terminalName,
      terminalStartupDir: props.terminalStartupDir,
      terminalStartupCommands: props.terminalStartupCommands,
    };
  }

  getRenderedTerminalTypesList = () => {
    const availableTerminals = [];
    const terminalsForRunningOs = TerminalTypes[osType];
    forIn(terminalsForRunningOs, (value) => {
      availableTerminals.push({
        label: value.label,
        name: value.name,
      });
    });
    return availableTerminals;
  };

  openDirectoryChooserDialog = () => {
    const path = electron.remote.dialog.showOpenDialog({
      properties: ['openDirectory'],
    });
    if (path && path.length) {
      this.setState({ terminalStartupDir: path[0] });
    }
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleFormSubmit = (event) => {
    event.preventDefault();
    const terminalCommandsStartup = this.state.terminalStartupCommands
      .split(/\r?\n/)
      .filter(singleLine => singleLine !== '');
    const terminalDataObject = {
      terminalType: this.state.terminalType,
      terminalName: this.state.terminalName,
      terminalStartupDir: this.state.terminalStartupDir,
      terminalStartupCommands: terminalCommandsStartup,
    };
    this.props.addNewTerminal(terminalDataObject);
  };

  renderAvailableTerminalList = () => {
    const availableTerminals = this.getRenderedTerminalTypesList();
    return availableTerminals.map(singleTerminalType => (
      <MenuItem key={singleTerminalType.name} value={singleTerminalType.name}>
        {singleTerminalType.label}
      </MenuItem>
    ));
  };

  render() {
    const { classes } = this.props;
    return (
      <Modal
        aria-labelledby="Add new Terminal instance"
        aria-describedby="Add new Terminal instance to your list of terminals and start hacking : )"
        open={this.props.opened}
        onClose={this.props.close}
      >
        <div style={getModalStyle()} className={classes.paper}>
          <form className="Add-Terminal" autoComplete="off" onSubmit={this.handleFormSubmit}>
            {!this.props.editMode && (
              <Typography type="title" align="center" id="modal-title">
                Add new Terminal
              </Typography>
            )}
            {this.props.editMode && (
              <Typography type="title" align="center" id="modal-title">
                Edit Terminal
              </Typography>
            )}
            <FormControl className={classes.formControl} required>
              <InputLabel htmlFor="terminal-type">Type</InputLabel>
              <Select
                value={this.state.terminalType}
                onChange={this.handleChange}
                input={<Input name="terminalType" id="terminal-type" />}
              >
                {this.renderAvailableTerminalList()}
              </Select>
              <FormHelperText>Please choose terminal type to launch for Your OS</FormHelperText>
            </FormControl>
            <FormControl className={classes.formControl} required>
              <InputLabel htmlFor="terminal-name">Name</InputLabel>
              <Input
                name="terminalName"
                id="terminal-name"
                onChange={this.handleChange}
                value={this.state.terminalName}
              />
              <FormHelperText>Enter terminal custom name</FormHelperText>
            </FormControl>
            <FormControl className={classes.formControl} required disabled>
              <InputLabel htmlFor="terminal-directory">Terminal startup path</InputLabel>
              <Input
                name="terminalStartupDir"
                id="terminal-directory"
                value={this.state.terminalStartupDir}
                endAdornment={
                  <InputAdornment position="end">
                    <Tooltip id="tooltip-add-new" title="Select directory">
                      <IconButton aria-label="Select directory" onClick={this.openDirectoryChooserDialog}>
                        <FolderOpenIcon />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                }
              />
              <FormHelperText>Terminal startup path</FormHelperText>
            </FormControl>
            <FormControl className={classes.formControl}>
              <TextField
                id="terminal-commands"
                label="Terminal startup commands"
                multiline
                rowsMax="5"
                defaultValue="Each line is separate command that is run when terminal is launched"
                margin="normal"
                name="terminalStartupCommands"
                onChange={this.handleChange}
              />
            </FormControl>
            <Button className={classes.button} raised color="primary" type="submit">
              <AddIcon className={classes.leftIcon} />
              Add
            </Button>
          </form>
        </div>
      </Modal>
    );
  }
}

AddEditTerminalWindow.propTypes = {
  opened: PropTypes.bool.isRequired,
  editMode: PropTypes.bool.isRequired,
  uuid: PropTypes.string.isRequired,
  terminalType: PropTypes.string.isRequired,
  terminalName: PropTypes.string.isRequired,
  terminalStartupDir: PropTypes.string.isRequired,
  terminalStartupCommands: PropTypes.string.isRequired,
  close: PropTypes.func.isRequired,
  addNewTerminal: PropTypes.func.isRequired,
  classes: PropTypes.shape({
    paper: PropTypes.string,
    button: PropTypes.string,
    leftIcon: PropTypes.string,
    formControl: PropTypes.string,
  }).isRequired,
};

const mapStateToProps = state => ({
  opened: state.TerminalAddEditWindowReducer.windowOpened,
  editMode: state.TerminalAddEditWindowReducer.editMode,
  uuid: state.TerminalAddEditWindowReducer.uuid,
  terminalType: state.TerminalAddEditWindowReducer.terminalType,
  terminalName: state.TerminalAddEditWindowReducer.terminalName,
  terminalStartupDir: state.TerminalAddEditWindowReducer.terminalStartupDir,
  terminalStartupCommands: state.TerminalAddEditWindowReducer.terminalStartupCommands,
});

const mapDispatchToProps = dispatch => ({
  close: () => dispatch(TerminalAddEditWindowActions.closeAddEditTerminalWindow()),
  addNewTerminal: terminalData =>
    dispatch(batchActions([
      TerminalActions.addNewTerminalInstance(terminalData),
      TerminalAddEditWindowActions.closeAddEditTerminalWindow(),
    ])),
});

const styledComponent = withStyles(styles)(AddEditTerminalWindow);
export default connect(mapStateToProps, mapDispatchToProps)(styledComponent);
