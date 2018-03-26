import { isUndefined } from 'lodash';
import TerminalActions from '../actions/TerminalActions';

const chokidar = require('chokidar');

let watchers = [];
let reduxStore = null;

const initialize = (initializedReduxStore) => {
  reduxStore = initializedReduxStore;
  watchers.forEach(singleWatcher => singleWatcher.close());
  watchers = [];
};

const addNewWatcher = (terminalUUID, dirsToWatch) => {
  const watcherInstance = chokidar.watch(dirsToWatch, {
    persistent: true,
  });

  watcherInstance.on('ready', () => {
    watcherInstance.on('all', () => {
      watcherInstance.close();
      reduxStore.dispatch(TerminalActions.reloadTerminalInstance(terminalUUID));
    });
  });
  watchers.push({ id: terminalUUID, watcher: watcherInstance });
};

const removeWatcher = (terminalUUID) => {
  const watcherObject = watchers.find(singleWatcher => singleWatcher.id === terminalUUID);
  if (isUndefined(watcherObject)) {
    return;
  }
  if (!watcherObject.watcher.closed) {
    watcherObject.watcher.close();
  }
  watcherObject.watcher = null;
  const updatedWatchers = watchers.filter(singleWatcher => singleWatcher.id !== terminalUUID);
  watchers = updatedWatchers;
};

export { initialize, addNewWatcher, removeWatcher };
