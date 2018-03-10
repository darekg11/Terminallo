import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import 'typeface-roboto';
import configureStore from './configureReduxStore';
import KeyboardShourtcutsService from './services/KeyboardShortcutsService';
import MainWindow from './components/MainWindow/MainWindow';
import './App.css';

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <MainWindow />
  </Provider>,
  document.getElementById('root'),
);

KeyboardShourtcutsService.initializeDefaults(store);
