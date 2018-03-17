import electron from 'electron';
import * as fsEtra from 'fs-extra';

const saveJsonToFile = async (filePath, jsonObject) => {
  if (!filePath || !jsonObject) {
    throw new Error('Missing file path or passed json object is empty');
  }
  try {
    await fsEtra.writeJson(filePath, jsonObject);
  } catch (err) {
    throw err;
  }
};

const loadJsonFromFile = async (filePath) => {
  if (!filePath) {
    throw new Error('Missing file path');
  }
  try {
    return await fsEtra.readJson(filePath);
  } catch (err) {
    throw err;
  }
};

const openDirectoryChooserDialog = () => {
  const selectedPath = electron.remote.dialog.showOpenDialog({
    properties: ['openDirectory'],
  });
  return selectedPath;
};

export { saveJsonToFile, loadJsonFromFile, openDirectoryChooserDialog };
