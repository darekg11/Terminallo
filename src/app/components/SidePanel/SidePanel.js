import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
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
    this.setState(prevState => ({ open: !prevState.open }));
  };

  render() {
    const { classes, terminals, selectTerminal } = this.props;
    const { open } = this.state;

    const drawer = (
      <Drawer
        open
        variant="permanent"
        classes={{
          docked: classes.root,
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
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse component="li" in={open} timeout="auto" unmountOnExit>
            <List disablePadding>
              {terminals.map(singleTerminal => (
                <ListItem
                  key={singleTerminal.id}
                  button
                  className={classes.nested}
                  onClick={() => selectTerminal(singleTerminal.id)}
                >
                  <ListItemText inset primary={singleTerminal.terminalName} />
                </ListItem>
              ))}
            </List>
          </Collapse>
        </List>
      </Drawer>
    );
    return drawer;
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
  selectTerminal: terminalId => dispatch(TerminalActions.selectTerminalInstance(terminalId)),
});

const styledComponent = withStyles(styles)(SidePanel);
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(styledComponent);
