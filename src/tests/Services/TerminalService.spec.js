import { expect } from 'chai';
import 'chai/register-should';
import sinon from 'sinon';
import * as TerminalService from '../../app/services/TerminalService';
import * as WatcherService from '../../app/services/WatcherService';

const pty = require('node-pty');

let sinonSandbox = null;

describe('Terminal service', () => {
  beforeEach(() => {
    sinonSandbox = sinon.createSandbox();
  });
  afterEach(() => {
    sinonSandbox.restore();
  });

  describe('exportTermninalsToObject', () => {
    it('should return empty object for empty input', () => {
      const result = TerminalService.exportTermninalsToObject([]);
      const expectedResult = {
        terminals: [],
      };
      expect(result).to.deep.equal(expectedResult);
    });

    it('should return converted terminals', () => {
      const input = [
        {
          id: '1234abcd',
          terminalType: 'CMD',
          terminalName: 'Test 1',
          terminalStartupDir: '../someDir/dir1',
          terminalStartupCommands: ['cd ..', 'cd ..'],
          terminalWatchers: ['../someDir', '../../someDir2'],
        },
        {
          id: '1234abcd5678',
          terminalType: 'CMD',
          terminalName: 'Test 2',
          terminalStartupDir: '../someDir/dir2',
          terminalStartupCommands: ['cd ..', 'cd ..', 'cd dir', 'ls'],
          terminalWatchers: ['someDir'],
        },
      ];
      const result = TerminalService.exportTermninalsToObject(input);
      const expectedResult = {
        terminals: [
          {
            terminalType: 'CMD',
            name: 'Test 1',
            terminalStartupDir: '../someDir/dir1',
            terminalStartupCommands: ['cd ..', 'cd ..'],
            terminalWatchers: ['../someDir', '../../someDir2'],
          },
          {
            terminalType: 'CMD',
            name: 'Test 2',
            terminalStartupDir: '../someDir/dir2',
            terminalStartupCommands: ['cd ..', 'cd ..', 'cd dir', 'ls'],
            terminalWatchers: ['someDir'],
          },
        ],
      };
      expect(result).to.deep.equal(expectedResult);
    });

    it('should return converted terminals with default fallback values', () => {
      const input = [
        {
          terminalType: 'CMD',
          terminalStartupDir: '../someDir/dir1',
        },
      ];
      const result = TerminalService.exportTermninalsToObject(input);
      expect(result.terminals.length).to.be.equal(1);
      expect(result.terminals[0].uuid).to.not.be.equal('');
      expect(result.terminals[0].terminalType).to.be.equal('CMD');
      expect(result.terminals[0].name).to.be.equal('Terminal');
      expect(result.terminals[0].terminalStartupDir).to.be.equal('../someDir/dir1');
      expect(result.terminals[0].terminalStartupCommands.length).to.be.equal(0);
      expect(result.terminals[0].terminalWatchers.length).to.be.equal(0);
    });
  });

  describe('importTerminalsToObject method', () => {
    it('should throw error when jsonFile does not exist', () => {
      expect(() => TerminalService.importTerminalsToObject()).to.throw(
        'Selected file is not valid for terminals import',
      );
    });

    it('should throw error when jsonFile is missing terminals property', () => {
      expect(() => TerminalService.importTerminalsToObject({})).to.throw(
        'Selected file is not valid for terminals import',
      );
    });

    it('should return empty array when terminals property is an empty array', () => {
      expect(TerminalService.importTerminalsToObject({ terminals: [] })).to.deep.equal({ terminals: [] });
    });

    it('should return converted terminals', () => {
      const testInput = {
        terminals: [
          {
            id: 'test1234',
            terminalType: 'someTerminalType',
            name: 'Terminal1',
            terminalStartupDir: 'SomePath',
            terminalStartupCommands: ['command1', 'command2'],
            terminalWatchers: ['someDir1', 'someDir2'],
          },
          {
            id: 'test5678',
            terminalType: 'anotherTerminalType',
            name: 'Terminal2',
            terminalStartupDir: 'SomeDifferentPath',
            terminalStartupCommands: ['cmd1', 'cmd2'],
            terminalWatchers: ['someDir'],
          },
        ],
      };
      const result = TerminalService.importTerminalsToObject(testInput);
      expect(result.terminals[0].id).to.not.be.equal('test1234');
      expect(result.terminals[0].terminalType).to.be.equal('someTerminalType');
      expect(result.terminals[0].terminalName).to.be.equal('Terminal1');
      expect(result.terminals[0].terminalStartupDir).to.be.equal('SomePath');
      expect(result.terminals[0].terminalStartupCommands[0]).to.be.equal('command1');
      expect(result.terminals[0].terminalStartupCommands[1]).to.be.equal('command2');
      expect(result.terminals[0].terminalWatchers[0]).to.be.equal('someDir1');
      expect(result.terminals[0].terminalWatchers[1]).to.be.equal('someDir2');

      expect(result.terminals[1].id).to.not.be.equal('test5678');
      expect(result.terminals[1].terminalType).to.be.equal('anotherTerminalType');
      expect(result.terminals[1].terminalName).to.be.equal('Terminal2');
      expect(result.terminals[1].terminalStartupDir).to.be.equal('SomeDifferentPath');
      expect(result.terminals[1].terminalStartupCommands[0]).to.be.equal('cmd1');
      expect(result.terminals[1].terminalStartupCommands[1]).to.be.equal('cmd2');
      expect(result.terminals[1].terminalWatchers[0]).to.be.equal('someDir');
    });

    it('should return fallback default value for terminals', () => {
      const testInput = {
        terminals: [
          {
            terminalType: 'someTerminalType',
          },
          {
            terminalType: 'anotherTerminalType',
          },
        ],
      };
      const result = TerminalService.importTerminalsToObject(testInput);
      expect(result.terminals[0].uuid).to.not.be.equal('');
      expect(result.terminals[0].terminalType).to.be.equal('someTerminalType');
      expect(result.terminals[0].terminalName).to.be.equal('Terminal');
      expect(result.terminals[0].terminalStartupDir).to.be.equal('');
      expect(result.terminals[0].terminalStartupCommands.length).to.be.equal(0);
      expect(result.terminals[0].terminalWatchers.length).to.be.equal(0);

      expect(result.terminals[1].uuid).to.not.be.equal('');
      expect(result.terminals[1].terminalType).to.be.equal('anotherTerminalType');
      expect(result.terminals[1].terminalName).to.be.equal('Terminal');
      expect(result.terminals[1].terminalStartupDir).to.be.equal('');
      expect(result.terminals[1].terminalStartupCommands.length).to.be.equal(0);
      expect(result.terminals[1].terminalWatchers.length).to.be.equal(0);
    });
  });

  describe('createNewTerminalInstance', () => {
    it('should create terminal instances, watchers and execute startup commands - unix', (done) => {
      sinonSandbox.spy(WatcherService, 'addNewWatcher');
      const virtualTerminalInstanceMock = {
        write: sinonSandbox.stub().returns({}),
        on: sinonSandbox.stub().returns({}),
      };
      sinonSandbox.stub(pty, 'spawn').returns(virtualTerminalInstanceMock);
      const terminalData = {
        terminalType: 'BASH',
        terminalStartupDir: '/home/test',
        terminalStartupCommands: ['pwd', 'ls -l'],
        terminalWatchers: ['/home/test/first', '/home/test/second'],
      };

      TerminalService.createNewTerminalInstance(terminalData);
      setTimeout(() => {
        expect(pty.spawn.calledOnce).to.be.equal(true);
        expect(pty.spawn.getCall(0).args[0]).to.be.equal('bash');
        expect(pty.spawn.getCall(0).args[2].name).to.be.equal('xterm-color');
        expect(pty.spawn.getCall(0).args[2].cwd).to.be.equal('/home/test');
        expect(virtualTerminalInstanceMock.write.callCount).to.be.equal(2);
        expect(virtualTerminalInstanceMock.write.getCall(0).args[0]).to.be.equal('pwd\n');
        expect(virtualTerminalInstanceMock.write.getCall(1).args[0]).to.be.equal('ls -l\n');
        expect(WatcherService.addNewWatcher.callCount).to.be.equal(1);
        expect(WatcherService.addNewWatcher.getCall(0).args[0]).to.not.be.equal('');
        expect(WatcherService.addNewWatcher.getCall(0).args[1][0]).to.be.equal('/home/test/first');
        expect(WatcherService.addNewWatcher.getCall(0).args[1][1]).to.be.equal('/home/test/second');
        done();
      }, 500);
    });
  });

  it('should create terminal instances, watchers and execute startup commands - windows', (done) => {
    sinonSandbox.spy(WatcherService, 'addNewWatcher');
    const virtualTerminalInstanceMock = {
      write: sinonSandbox.stub().returns({}),
      on: sinonSandbox.stub().returns({}),
    };
    sinonSandbox.stub(pty, 'spawn').returns(virtualTerminalInstanceMock);
    const terminalData = {
      terminalType: 'CMD',
      terminalStartupDir: 'C:/someDir',
      terminalStartupCommands: ['dir', 'mkdir'],
      terminalWatchers: ['C:/someDir/first', 'C:/someDir/second'],
    };

    TerminalService.createNewTerminalInstance(terminalData);
    setTimeout(() => {
      expect(pty.spawn.calledOnce).to.be.equal(true);
      expect(pty.spawn.getCall(0).args[0]).to.be.equal('cmd');
      expect(pty.spawn.getCall(0).args[2].name).to.be.equal('xterm-color');
      expect(pty.spawn.getCall(0).args[2].cwd).to.be.equal('C:/someDir');
      expect(virtualTerminalInstanceMock.write.callCount).to.be.equal(2);
      expect(virtualTerminalInstanceMock.write.getCall(0).args[0]).to.be.equal('dir\n');
      expect(virtualTerminalInstanceMock.write.getCall(1).args[0]).to.be.equal('mkdir\n');
      done();
    }, 500);
  });

  describe('killTerminalInstance method', () => {
    it('should call closing method on terminal instance', () => {
      const terminalInstance = {
        uuid: 'someUuid',
        xTermInstance: {
          destroy: sinon.spy(),
        },
        virtualTerminalInstance: {
          kill: sinon.spy(),
        },
        watcherInstance: {
          close: sinon.spy(),
        },
      };
      TerminalService.killTerminalInstance(terminalInstance);
      expect(terminalInstance.xTermInstance.destroy.calledOnce).to.be.equal(true);
      expect(terminalInstance.virtualTerminalInstance.kill.calledOnce).to.be.equal(true);
      expect(WatcherService.removeWatcher.calledOnce).to.be.equal(true);
      expect(WatcherService.removeWatcher.getCall(0).args[0]).to.be.equal('someUuid');
    });
  });
});
