import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import List, { ListItem, ListItemIcon, ListItemText } from '@material-ui/core/List';
import Collapse from '@material-ui/core/Collapse';
import KeyboardIcon from '@material-ui/icons/Keyboard';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import TerminalActions from '../../actions/TerminalActions';

const drawerWidth = 200;

const styles = theme => ({
  root: {
    height: '100vh',
    zIndex: 1,
  },
  drawerPaper: {
    position: 'relative',
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  nested: {
    paddingLeft: theme.spacing.unit * 4,
  },
});

class SidePanel extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      open: true,
    };
  }

  handleClick = () => {
    this.setState({ open: !this.state.open });
  };

  render() {
    const { classes } = this.props;

    const drawer = (
      <Drawer
        type="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="left"
      >
        <div className={classes.drawerHeader}>
          <Typography>Terminallo - Menu</Typography>
        </div>
        <Divider />
        <List>
          <ListItem button onClick={this.handleClick}>
            <ListItemIcon>
              <KeyboardIcon />
            </ListItemIcon>
            <ListItemText inset primary="Terminals" />
            {this.state.open ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse component="li" in={this.state.open} timeout="auto" unmountOnExit>
            <List disablePadding>
              {this.props.terminals.map(singleTerminal => (
                <ListItem
                  key={singleTerminal.uuid}
                  button
                  className={classes.nested}
                  onClick={() => this.props.selectTerminal(singleTerminal.uuid)}
                >
                  <ListItemText inset primary={singleTerminal.terminalName} />
                </ListItem>
              ))}
            </List>
          </Collapse>
        </List>
      </Drawer>
    );
    return (
      <div className={classes.root}>
        <div className={classes.appFrame}>{drawer}</div>
      </div>
    );
  }
}

SidePanel.propTypes = {
  classes: PropTypes.shape({
    root: PropTypes.string,
    drawerPaper: PropTypes.string,
    drawerHeader: PropTypes.string,
    nested: PropTypes.string,
  }).isRequired,
  terminals: PropTypes.arrayOf(
    PropTypes.shape({
      terminalName: PropTypes.string.isRequired,
    }),
  ),
  selectTerminal: PropTypes.func.isRequired,
};

SidePanel.defaultProps = {
  terminals: [],
};

const mapStateToProps = state => ({
  terminals: state.TerminalsReducer.terminals,
});

const mapDispatchToProps = dispatch => ({
  selectTerminal: terminalUUID => dispatch(TerminalActions.selectTerminalInstance(terminalUUID)),
});

const styledComponent = withStyles(styles)(SidePanel);
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(styledComponent);
