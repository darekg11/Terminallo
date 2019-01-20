import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import './MainPanel.css';

const styles = theme => ({
  content: {
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    flexDirection: 'column',
  },
});

const MainPanel = ({ children, classes }) => (
  <div className="Main-Panel">
    <div className={classes.content}>{children}</div>
  </div>
);

MainPanel.propTypes = {
  classes: PropTypes.shape({
    content: PropTypes.string,
  }).isRequired,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default withStyles(styles)(MainPanel);
