import React, { Component } from 'react';
import { connect } from 'react-redux';
import { batchActions } from 'redux-batched-actions';
import os from 'os';
import { forIn } from 'lodash';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import AddIcon from '@material-ui/icons/Add';
import SaveIcon from '@material-ui/icons/Save';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import TerminalAddEditWindowActions from '../../actions/TerminalAddEditWindowActions';
import TerminalActions from '../../actions/TerminalActions';
import TerminalTypes from '../../enums/TerminalTypes';
import * as FileService from '../../services/FileService';
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
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flex: 1,
    textAlign: 'center',
    flexShrink: 0,
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
      terminalStartupCommands: props.terminalStartupCommands.join('\n'),
      watchersMenuExpanded: false,
      terminalWatchers: props.terminalWatchers,
      addStartUpDirToWatchers: props.terminalWatchers.includes(
        props.terminalStartupDir,
      ),
    };
  }

  componentWillReceiveProps(nextProps) {
    const { uuid } = this.props;
    if (uuid !== nextProps.uuid) {
      const {
        terminalType,
        terminalName,
        terminalStartupDir,
        terminalWatchers,
      } = nextProps;
      let { terminalStartupCommands } = nextProps;
      terminalStartupCommands = terminalStartupCommands.join('\n');
      const addStartUpDirToWatchers = terminalWatchers.includes(
        terminalStartupDir,
      );
      this.setState({
        terminalType,
        terminalName,
        terminalStartupDir,
        terminalStartupCommands,
        addStartUpDirToWatchers,
        terminalWatchers,
      });
    }
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

  chooseDirectory = () => {
    const path = FileService.openDirectoryChooserDialog();
    if (path && path.length) {
      this.setState({ terminalStartupDir: path[0] });
    }
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleChangeCheckbox = name => (event) => {
    this.setState({ [name]: event.target.checked });
  };

  handleWatcherExpansionChange = () => {
    this.setState(prevState => ({ watchersMenuExpanded: !prevState.watchersMenuExpanded }));
  };

  handleFormSubmit = (event) => {
    const {
      terminalStartupCommands,
      addStartUpDirToWatchers,
      terminalWatchers,
      terminalStartupDir,
      terminalType,
      terminalName,
    } = this.state;
    const {
      addNewTerminal, editTerminal, editMode, uuid,
    } = this.props;
    event.preventDefault();
    const terminalCommandsStartup = terminalStartupCommands
      .split(/\r?\n/)
      .filter(singleLine => singleLine !== '');
    let terminalWatchersInstances = [];
    if (addStartUpDirToWatchers) {
      terminalWatchersInstances.push(terminalStartupDir);
    }
    terminalWatchersInstances = [...terminalWatchersInstances, ...terminalWatchers];
    const terminalDataObject = {
      terminalType,
      terminalName,
      terminalStartupDir,
      terminalStartupCommands: terminalCommandsStartup,
      terminalWatchers: terminalWatchersInstances,
    };
    if (!editMode) {
      addNewTerminal(terminalDataObject);
    } else {
      terminalDataObject.uuid = uuid;
      editTerminal(terminalDataObject);
    }
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
    const {
      classes, editMode, opened, close,
    } = this.props;
    const {
      terminalType, terminalName, terminalStartupDir,
      terminalStartupCommands, watchersMenuExpanded, addStartUpDirToWatchers,
    } = this.state;
    return (
      <Modal
        aria-labelledby={
          !editMode
            ? 'Add new Terminal Instance'
            : 'Edit terminal instance'
        }
        aria-describedby={
          !editMode
            ? 'Add new Terminal instance to your list of terminals and start hacking : )'
            : 'Edit your terminal instance and hack even more : )'
        }
        open={opened}
        onClose={close}
      >
        <div style={getModalStyle()} className={classes.paper}>
          <form
            className="Add-Terminal"
            autoComplete="off"
            onSubmit={this.handleFormSubmit}
          >
            {!editMode && (
              <Typography variant="h6" align="center" id="modal-title">
                Add new Terminal
              </Typography>
            )}
            {editMode && (
              <Typography variant="h6" align="center" id="modal-title">
                Edit Terminal
              </Typography>
            )}
            <FormControl className={classes.formControl} required>
              <InputLabel htmlFor="terminal-type">Type</InputLabel>
              <Select
                value={terminalType}
                onChange={this.handleChange}
                input={<Input name="terminalType" id="terminal-type" />}
              >
                {this.renderAvailableTerminalList()}
              </Select>
              <FormHelperText>
                Please choose terminal type to launch for Your OS
              </FormHelperText>
            </FormControl>
            <FormControl className={classes.formControl} required>
              <InputLabel htmlFor="terminal-name">Name</InputLabel>
              <Input
                name="terminalName"
                id="terminal-name"
                onChange={this.handleChange}
                value={terminalName}
              />
              <FormHelperText>Enter terminal custom name</FormHelperText>
            </FormControl>
            <FormControl className={classes.formControl} required disabled>
              <InputLabel htmlFor="terminal-directory">
                Terminal startup path
              </InputLabel>
              <Input
                name="terminalStartupDir"
                id="terminal-directory"
                value={terminalStartupDir}
                endAdornment={(
                  <InputAdornment position="end">
                    <Tooltip id="tooltip-add-new" title="Select directory">
                      <IconButton
                        aria-label="Select directory"
                        onClick={this.chooseDirectory}
                      >
                        <FolderOpenIcon />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                )}
              />
              <FormHelperText>Terminal startup path</FormHelperText>
            </FormControl>
            <FormControl className={classes.formControl}>
              <TextField
                id="terminal-commands"
                label="Terminal startup commands"
                multiline
                rowsMax="5"
                margin="normal"
                name="terminalStartupCommands"
                value={terminalStartupCommands}
                onChange={this.handleChange}
              />
            </FormControl>
            <FormControl className={classes.formControl}>
              <ExpansionPanel
                expanded={watchersMenuExpanded}
                onChange={this.handleWatcherExpansionChange}
              >
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography className={classes.heading}>Watchers</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <FormControlLabel
                    control={(
                      <Checkbox
                        checked={addStartUpDirToWatchers}
                        onChange={this.handleChangeCheckbox(
                          'addStartUpDirToWatchers',
                        )}
                        value="addStartUpDirToWatchers"
                      />
                    )}
                    label="Automatically include terminal startup dir"
                  />
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </FormControl>
            {!editMode && (
              <Button
                className={classes.button}
                variant="contained"
                color="primary"
                type="submit"
              >
                <AddIcon className={classes.leftIcon} />
                Add
              </Button>
            )}
            {editMode && (
              <Button
                className={classes.button}
                variant="contained"
                color="primary"
                type="submit"
              >
                <SaveIcon className={classes.leftIcon} />
                Save
              </Button>
            )}
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
  terminalStartupCommands: PropTypes.arrayOf(PropTypes.string).isRequired,
  terminalWatchers: PropTypes.arrayOf(PropTypes.string).isRequired,
  close: PropTypes.func.isRequired,
  addNewTerminal: PropTypes.func.isRequired,
  editTerminal: PropTypes.func.isRequired,
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
  terminalStartupCommands:
    state.TerminalAddEditWindowReducer.terminalStartupCommands,
  terminalWatchers: state.TerminalAddEditWindowReducer.terminalWatchers,
});

const mapDispatchToProps = dispatch => ({
  close: () => dispatch(TerminalAddEditWindowActions.closeAddEditTerminalWindow()),
  addNewTerminal: terminalData => dispatch(
    batchActions([
      TerminalActions.addNewTerminalInstance(terminalData),
      TerminalAddEditWindowActions.closeAddEditTerminalWindow(),
    ]),
  ),
  editTerminal: terminalData => dispatch(
    batchActions([
      TerminalActions.editTerminalInstance(terminalData),
      TerminalActions.reloadTerminalInstance(terminalData.uuid),
      TerminalAddEditWindowActions.closeAddEditTerminalWindow(),
    ]),
  ),
});

const styledComponent = withStyles(styles)(AddEditTerminalWindow);
export default connect(mapStateToProps, mapDispatchToProps)(styledComponent);
