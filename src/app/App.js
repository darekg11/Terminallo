import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import 'typeface-roboto';
import configureStore from './configureReduxStore';
import KeyboardShourtcutsService from './services/KeyboardShortcutsService';
import * as WatcherService from './services/WatcherService';
import MainWindow from './components/MainWindow/MainWindow';
import './App.css';

const store = configureStore();

const App = () => (
  <Provider store={store}>
    <MainWindow />
  </Provider>
);

ReactDOM.render(<App />, document.getElementById('root') || document.createElement('div'));

KeyboardShourtcutsService.initializeDefaults(store);
WatcherService.initialize(store);

export default App;
