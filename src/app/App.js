import os from 'os';
import React from 'react';
import ReactDOM from 'react-dom';
import 'typeface-roboto';
import MainWindow from './components/MainWindow/MainWindow';
import './App.css';

const pty = require('node-pty');

const shell = process.env[os.platform() === 'win32' ? 'COMSPEC' : 'SHELL'];

const ptyProcess = pty.spawn(shell, [], {
  name: 'xterm-color',
  cols: 80,
  rows: 30,
  cwd: process.cwd(),
  env: process.env,
});

console.log(`Created terminal with PID: ${ptyProcess.pid}`);
ptyProcess.on('data', (data) => {
  console.log(data);
});

ptyProcess.write('dir\r');

ReactDOM.render(<MainWindow />, document.getElementById('root'));
