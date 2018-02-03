const { app, BrowserWindow } = require('electron');
const isDev = require('electron-is-dev');

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', () => {
  let mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    title: 'Terminallo',
  });
  mainWindow.setMinimumSize(1280, 720);

  const indexPathToLoad = isDev
    ? `file://${__dirname}/public/index.dev.html`
    : `file://${__dirname}/public/index.prod.html`;

  mainWindow.loadURL(indexPathToLoad);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});
