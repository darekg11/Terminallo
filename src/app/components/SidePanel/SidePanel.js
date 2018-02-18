import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import Typography from 'material-ui/Typography';
import Divider from 'material-ui/Divider';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Collapse from 'material-ui/transitions/Collapse';
import KeyboardIcon from 'material-ui-icons/Keyboard';
import ExpandLess from 'material-ui-icons/ExpandLess';
import ExpandMore from 'material-ui-icons/ExpandMore';
import Star from 'material-ui-icons/Star';

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
                <ListItem key={singleTerminal.uuid} button className={classes.nested}>
                  <ListItemText inset primary={singleTerminal.terminalName} />
                </ListItem>
              ))}
            </List>
          </Collapse>
          <ListItem button>
            <ListItemIcon>
              <Star />
            </ListItemIcon>
            <ListItemText inset primary="Favourites terminals" />
            {this.state.open ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
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
  terminals: PropTypes.arrayOf(PropTypes.shape({
    terminalName: PropTypes.string.isRequired,
  })),
};

SidePanel.defaultProps = {
  terminals: [],
};

const mapStateToProps = state => ({
  terminals: state.TerminalsReducer.terminals,
});

const styledComponent = withStyles(styles)(SidePanel);
export default connect(mapStateToProps, null)(styledComponent);
