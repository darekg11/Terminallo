import React from 'react';
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
import StarBorder from 'material-ui-icons/StarBorder';

import TerminalView from '../Terminal/Terminal';

const drawerWidth = 200;

const styles = theme => ({
  root: {
    width: '100%',
    height: '100vh',
    zIndex: 1,
    overflow: 'hidden',
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
  appFrame: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: '100%',
  },
  content: {
    backgroundColor: theme.palette.background.default,
    width: '100%',
    height: '100%',
    padding: theme.spacing.unit * 2,
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
              <ListItem button className={classes.nested}>
                <ListItemIcon>
                  <StarBorder />
                </ListItemIcon>
                <ListItemText inset primary="Terminal 1" />
              </ListItem>
            </List>
          </Collapse>
        </List>
      </Drawer>
    );
    return (
      <div className={classes.root}>
        <div className={classes.appFrame}>
          {drawer}
          <main className={classes.content}>
            <TerminalView />
          </main>
        </div>
      </div>
    );
  }
}

SidePanel.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SidePanel);
