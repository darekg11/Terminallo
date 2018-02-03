import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import './MainPanel.css';

const styles = theme => ({
  content: {
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    flexDirection: 'column',
  },
});

function MainPanel(props) {
  const { classes } = props;
  return (
    <div className="Main-Panel">
      <div className={classes.content}>{props.children}</div>
    </div>
  );
}

MainPanel.propTypes = {
  classes: PropTypes.shape({
    content: PropTypes.string,
  }).isRequired,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default withStyles(styles)(MainPanel);
