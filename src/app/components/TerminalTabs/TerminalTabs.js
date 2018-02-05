import React from 'react';
import Paper from 'material-ui/Paper';
import Tabs, { Tab } from 'material-ui/Tabs';
import Terminal from '../Terminal/Terminal';
import './TerminalTabs.css';

class TerminalTabs extends React.Component {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { value } = this.state;

    return (
      <Paper className="Terminal-Tabs">
        <Tabs value={this.state.value} onChange={this.handleChange} indicatorColor="primary" textColor="primary">
          <Tab label="Item One" />
          <Tab label="Item Two" />
          <Tab label="Item Three" />
        </Tabs>
        {/* {value === 0 && <Terminal />} */}
      </Paper>
    );
  }
}

export default TerminalTabs;
