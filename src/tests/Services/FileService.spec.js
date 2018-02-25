import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import * as FileService from '../../app/services/FileService';

let sinonSandbox = null;

chai.use(chaiAsPromised);

describe('FileService', () => {
  beforeEach(() => {
    sinonSandbox = sinon.sandbox.create();
  });
  afterEach(() => {
    sinonSandbox.restore();
  });

  describe('saveJsonToFile method', () => {
    it('should throw error when filePath does not exist', () => {
      expect(FileService.saveJsonToFile(null, {})).to.be.rejectedWith('Missing file path or passed json object is empty');
    });

    it('should throw error when jsonObject does not exist', () => {
      expect(FileService.saveJsonToFile('somePath')).to.be.rejectedWith('Missing file path or passed json object is empty');
    });

    it('should throw error when filePath and jsonObject does not exist', () => {
      expect(FileService.saveJsonToFile()).to.be.rejectedWith('Missing file path or passed json object is empty');
    });
  });

  describe('loadJsonFromFile method', () => {
    it('should throw error when filePath does not exist', () => {
      expect(FileService.loadJsonFromFile()).to.be.rejectedWith('Missing file path');
    });
  });
});
