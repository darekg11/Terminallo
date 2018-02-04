import electron from 'electron';
import React, { Component } from 'react';
import { connect } from 'react-redux';
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
import ApplicationActions from '../../actions/ApplicationActions';
import TerminalTypes from '../../enums/TerminalTypes';
import './AddTerminalWindow.css';

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

class AddNewTerminalWindow extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      terminalType: '',
      terminalName: '',
      terminalStartupDir: '',
      terminalStartupCommands: [],
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
      <div>
        <Modal
          aria-labelledby="Add new Terminal instance"
          aria-describedby="Add new Terminal instance to your list of terminals and start hacking : )"
          open={this.props.opened}
          onClose={this.props.close}
        >
          <div style={getModalStyle()} className={classes.paper}>
            <form className="Add-Terminal" autoComplete="off">
              <Typography type="title" align="center" id="modal-title">
                Add new Terminal
              </Typography>
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
                <Input name="terminalName" id="terminal-name" onChange={this.handleChange} />
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
                />
              </FormControl>
              <Button className={classes.button} raised color="primary" type="submit">
                <AddIcon className={classes.leftIcon} />
                Add
              </Button>
            </form>
          </div>
        </Modal>
      </div>
    );
  }
}

AddNewTerminalWindow.propTypes = {
  opened: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  classes: PropTypes.shape({
    paper: PropTypes.string,
    button: PropTypes.string,
    leftIcon: PropTypes.string,
    formControl: PropTypes.string,
  }).isRequired,
};

const mapStateToProps = state => ({
  opened: state.ApplicationStateReducer.addNewTerminalWindowOpened,
});

const mapDispatchToProps = dispatch => ({
  close: () => dispatch(ApplicationActions.closeAddNewTerminalModalWindow()),
});

const styledComponent = withStyles(styles)(AddNewTerminalWindow);
export default connect(mapStateToProps, mapDispatchToProps)(styledComponent);
