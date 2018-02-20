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

exports.saveJsonToFile = saveJsonToFile;
