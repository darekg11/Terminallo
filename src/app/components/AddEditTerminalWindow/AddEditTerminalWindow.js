import React, { Component } from "react";
import { connect } from "react-redux";
import { batchActions } from "redux-batched-actions";
import os from "os";
import { forIn } from "lodash";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import ExpansionPanel, {
  ExpansionPanelDetails,
  ExpansionPanelSummary
} from "@material-ui/core/ExpansionPanel";
import Input, { InputLabel, InputAdornment } from "@material-ui/core/Input";
import { MenuItem } from "@material-ui/core/Menu";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import {
  FormControl,
  FormControlLabel,
  FormHelperText
} from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import FolderOpenIcon from "@material-ui/icons/FolderOpen";
import AddIcon from "@material-ui/icons/Add";
import SaveIcon from "@material-ui/icons/Save";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import TerminalAddEditWindowActions from "../../actions/TerminalAddEditWindowActions";
import TerminalActions from "../../actions/TerminalActions";
import TerminalTypes from "../../enums/TerminalTypes";
import * as FileService from "../../services/FileService";
import "./AddEditTerminalWindow.css";

const osType = os.platform() === "win32" ? "windows" : "unix";

function getModalStyle() {
  return {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)"
  };
}

const styles = theme => ({
  paper: {
    position: "absolute",
    width: theme.spacing.unit * 60,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4
  },
  button: {
    margin: theme.spacing.unit,
    alignSelf: "flex-end"
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  },
  formControl: {
    margin: theme.spacing.unit
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flex: 1,
    textAlign: "center",
    flexShrink: 0
  }
});

class AddEditTerminalWindow extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      terminalType: props.terminalType,
      terminalName: props.terminalName,
      terminalStartupDir: props.terminalStartupDir,
      terminalStartupCommands: props.terminalStartupCommands.join("\n"),
      watchersMenuExpanded: false,
      terminalWatchers: props.terminalWatchers,
      addStartUpDirToWatchers: props.terminalWatchers.includes(
        props.terminalStartupDir
      )
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.uuid !== nextProps.uuid) {
      const {
        terminalType,
        terminalName,
        terminalStartupDir,
        terminalWatchers
      } = nextProps;
      let { terminalStartupCommands } = nextProps;
      terminalStartupCommands = terminalStartupCommands.join("\n");
      const addStartUpDirToWatchers = terminalWatchers.includes(
        terminalStartupDir
      );
      this.setState({
        terminalType,
        terminalName,
        terminalStartupDir,
        terminalStartupCommands,
        addStartUpDirToWatchers,
        terminalWatchers
      });
    }
  }

  getRenderedTerminalTypesList = () => {
    const availableTerminals = [];
    const terminalsForRunningOs = TerminalTypes[osType];
    forIn(terminalsForRunningOs, value => {
      availableTerminals.push({
        label: value.label,
        name: value.name
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

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleChangeCheckbox = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  handleWatcherExpansionChange = () => {
    this.setState({ watchersMenuExpanded: !this.state.watchersMenuExpanded });
  };

  handleFormSubmit = event => {
    event.preventDefault();
    const terminalCommandsStartup = this.state.terminalStartupCommands
      .split(/\r?\n/)
      .filter(singleLine => singleLine !== "");
    let terminalWatchers = [];
    if (this.state.addStartUpDirToWatchers) {
      terminalWatchers.push(this.state.terminalStartupDir);
    }
    terminalWatchers = [...terminalWatchers, ...this.state.terminalWatchers];
    const terminalDataObject = {
      terminalType: this.state.terminalType,
      terminalName: this.state.terminalName,
      terminalStartupDir: this.state.terminalStartupDir,
      terminalStartupCommands: terminalCommandsStartup,
      terminalWatchers
    };
    if (!this.props.editMode) {
      this.props.addNewTerminal(terminalDataObject);
    } else {
      terminalDataObject.uuid = this.props.uuid;
      this.props.editTerminal(terminalDataObject);
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
    const { classes } = this.props;
    return (
      <Modal
        aria-labelledby={
          !this.props.editMode
            ? "Add new Terminal Instance"
            : "Edit terminal instance"
        }
        aria-describedby={
          !this.props.editMode
            ? "Add new Terminal instance to your list of terminals and start hacking : )"
            : "Edit your terminal instance and hack even more : )"
        }
        open={this.props.opened}
        onClose={this.props.close}
      >
        <div style={getModalStyle()} className={classes.paper}>
          <form
            className="Add-Terminal"
            autoComplete="off"
            onSubmit={this.handleFormSubmit}
          >
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
                value={this.state.terminalName}
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
                value={this.state.terminalStartupDir}
                endAdornment={
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
                margin="normal"
                name="terminalStartupCommands"
                value={this.state.terminalStartupCommands}
                onChange={this.handleChange}
              />
            </FormControl>
            <FormControl className={classes.formControl}>
              <ExpansionPanel
                expanded={this.state.watchersMenuExpanded}
                onChange={this.handleWatcherExpansionChange}
              >
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography className={classes.heading}>Watchers</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={this.state.addStartUpDirToWatchers}
                        onChange={this.handleChangeCheckbox(
                          "addStartUpDirToWatchers"
                        )}
                        value="addStartUpDirToWatchers"
                      />
                    }
                    label="Automatically include terminal startup dir"
                  />
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </FormControl>
            {!this.props.editMode && (
              <Button
                className={classes.button}
                raised
                color="primary"
                type="submit"
              >
                <AddIcon className={classes.leftIcon} />
                Add
              </Button>
            )}
            {this.props.editMode && (
              <Button
                className={classes.button}
                raised
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
    formControl: PropTypes.string
  }).isRequired
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
  terminalWatchers: state.TerminalAddEditWindowReducer.terminalWatchers
});

const mapDispatchToProps = dispatch => ({
  close: () =>
    dispatch(TerminalAddEditWindowActions.closeAddEditTerminalWindow()),
  addNewTerminal: terminalData =>
    dispatch(
      batchActions([
        TerminalActions.addNewTerminalInstance(terminalData),
        TerminalAddEditWindowActions.closeAddEditTerminalWindow()
      ])
    ),
  editTerminal: terminalData =>
    dispatch(
      batchActions([
        TerminalActions.editTerminalInstance(terminalData),
        TerminalActions.reloadTerminalInstance(terminalData.uuid),
        TerminalAddEditWindowActions.closeAddEditTerminalWindow()
      ])
    )
});

const styledComponent = withStyles(styles)(AddEditTerminalWindow);
export default connect(mapStateToProps, mapDispatchToProps)(styledComponent);
