import os from 'os';
import { Terminal } from 'xterm';
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
      sinonSandbox.stub(os, 'platform').returns('unix');
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
    sinonSandbox.stub(os, 'platform').returns('win32');
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
      expect(pty.spawn.getCall(0).args[0]).to.be.equal('cmd.exe');
      expect(pty.spawn.getCall(0).args[2].name).to.be.equal('xterm-color');
      expect(pty.spawn.getCall(0).args[2].cwd).to.be.equal('C:/someDir');
      expect(virtualTerminalInstanceMock.write.callCount).to.be.equal(2);
      expect(virtualTerminalInstanceMock.write.getCall(0).args[0]).to.be.equal('dir\n');
      expect(virtualTerminalInstanceMock.write.getCall(1).args[0]).to.be.equal('mkdir\n');
      done();
    }, 500);
  });

  describe('resizeTerminal method', () => {
    it('should resize terminal if terminal instance is registered', () => {
      sinonSandbox.stub(os, 'platform').returns('unix');
      const virtualTerminalInstanceMock = {
        write: sinonSandbox.stub().returns({}),
        on: sinonSandbox.stub().returns({}),
        resize: sinonSandbox.stub().returns({}),
      };
      const xTermInstance = {
        applyAddon: sinonSandbox.stub().returns({}),
        proposeGeometry: sinonSandbox.stub().returns({ rows: 20, cols: 50 }),
        fit: sinonSandbox.stub().returns({}),
        attachCustomKeyEventHandler: sinonSandbox.stub().returns({}),
      };
      sinonSandbox.stub(Terminal, 'applyAddon').returns(xTermInstance.applyAddon);
      sinonSandbox.stub(Terminal.prototype, 'proposeGeometry').returns(xTermInstance.proposeGeometry);
      sinonSandbox.stub(Terminal.prototype, 'fit').returns(xTermInstance.fit);
      sinonSandbox
        .stub(Terminal.prototype, 'attachCustomKeyEventHandler')
        .returns(xTermInstance.attachCustomKeyEventHandler);
      sinonSandbox.stub(pty, 'spawn').returns(virtualTerminalInstanceMock);
      const terminalData = {
        terminalType: 'BASH',
        terminalStartupDir: '/home/test',
        terminalStartupCommands: ['pwd', 'ls -l'],
        terminalWatchers: ['/home/test/first', '/home/test/second'],
      };

      const terminalId = TerminalService.createNewTerminalInstance(terminalData);
      TerminalService.resizeTerminal(terminalId);
      expect(Terminal.prototype.proposeGeometry.calledOnce).to.be.equal(true);
      expect(Terminal.prototype.fit.calledOnce).to.be.equal(true);
      expect(virtualTerminalInstanceMock.resize.calledOnce).to.be.equal(true);
    });

    it('should not resize terminal if terminal instance is not registered', () => {
      sinonSandbox.stub(os, 'platform').returns('unix');
      const virtualTerminalInstanceMock = {
        write: sinonSandbox.stub().returns({}),
        on: sinonSandbox.stub().returns({}),
        resize: sinonSandbox.stub().returns({}),
      };
      const xTermInstance = {
        applyAddon: sinonSandbox.stub().returns({}),
        proposeGeometry: sinonSandbox.stub().returns({ rows: 20, cols: 50 }),
        fit: sinonSandbox.stub().returns({}),
        attachCustomKeyEventHandler: sinonSandbox.stub().returns({}),
      };
      sinonSandbox.stub(Terminal, 'applyAddon').returns(xTermInstance.applyAddon);
      sinonSandbox.stub(Terminal.prototype, 'proposeGeometry').returns(xTermInstance.proposeGeometry);
      sinonSandbox.stub(Terminal.prototype, 'fit').returns(xTermInstance.fit);
      sinonSandbox
        .stub(Terminal.prototype, 'attachCustomKeyEventHandler')
        .returns(xTermInstance.attachCustomKeyEventHandler);
      sinonSandbox.stub(pty, 'spawn').returns(virtualTerminalInstanceMock);
      const terminalData = {
        terminalType: 'BASH',
        terminalStartupDir: '/home/test',
        terminalStartupCommands: ['pwd', 'ls -l'],
        terminalWatchers: ['/home/test/first', '/home/test/second'],
      };

      TerminalService.createNewTerminalInstance(terminalData);
      TerminalService.resizeTerminal('not-existing');
      expect(Terminal.prototype.proposeGeometry.callCount).to.be.equal(0);
      expect(Terminal.prototype.fit.callCount).to.be.equal(0);
      expect(virtualTerminalInstanceMock.resize.callCount).to.be.equal(0);
    });
  });

  describe('killTerminalInstance method', () => {
    it('should call closing method on terminal instance', () => {
      sinonSandbox.stub(os, 'platform').returns('unix');
      sinonSandbox.stub(WatcherService, 'removeWatcher');
      const virtualTerminalInstanceMock = {
        write: sinonSandbox.stub().returns({}),
        on: sinonSandbox.stub().returns({}),
        resize: sinonSandbox.stub().returns({}),
        kill: sinonSandbox.stub().returns({}),
      };
      const xTermInstance = {
        applyAddon: sinonSandbox.stub().returns({}),
        attachCustomKeyEventHandler: sinonSandbox.stub().returns({}),
        dispose: sinonSandbox.stub().returns({}),
      };
      sinonSandbox.stub(Terminal, 'applyAddon').returns(xTermInstance.applyAddon);
      sinonSandbox.stub(Terminal.prototype, 'dispose').returns(xTermInstance.dispose);
      sinonSandbox
        .stub(Terminal.prototype, 'attachCustomKeyEventHandler')
        .returns(xTermInstance.attachCustomKeyEventHandler);
      sinonSandbox.stub(pty, 'spawn').returns(virtualTerminalInstanceMock);
      const terminalData = {
        terminalType: 'BASH',
        terminalStartupDir: '/home/test',
        terminalStartupCommands: ['pwd', 'ls -l'],
        terminalWatchers: ['/home/test/first', '/home/test/second'],
      };

      const createdTerminalInstanceId = TerminalService.createNewTerminalInstance(terminalData);
      TerminalService.killTerminalInstance(createdTerminalInstanceId);
      expect(Terminal.prototype.dispose.calledOnce).to.be.equal(true);
      expect(virtualTerminalInstanceMock.kill.calledOnce).to.be.equal(true);
      expect(WatcherService.removeWatcher.calledOnce).to.be.equal(true);
      expect(WatcherService.removeWatcher.getCall(0).args[0]).to.be.equal(createdTerminalInstanceId);
    });

    it('should not call closing method on terminal instance when that terminal instance is not registered', () => {
      sinonSandbox.stub(os, 'platform').returns('unix');
      sinonSandbox.stub(WatcherService, 'removeWatcher');
      const virtualTerminalInstanceMock = {
        write: sinonSandbox.stub().returns({}),
        on: sinonSandbox.stub().returns({}),
        resize: sinonSandbox.stub().returns({}),
        kill: sinonSandbox.stub().returns({}),
      };
      const xTermInstance = {
        applyAddon: sinonSandbox.stub().returns({}),
        attachCustomKeyEventHandler: sinonSandbox.stub().returns({}),
        dispose: sinonSandbox.stub().returns({}),
      };
      sinonSandbox.stub(Terminal, 'applyAddon').returns(xTermInstance.applyAddon);
      sinonSandbox.stub(Terminal.prototype, 'dispose').returns(xTermInstance.dispose);
      sinonSandbox
        .stub(Terminal.prototype, 'attachCustomKeyEventHandler')
        .returns(xTermInstance.attachCustomKeyEventHandler);
      sinonSandbox.stub(pty, 'spawn').returns(virtualTerminalInstanceMock);
      const terminalData = {
        terminalType: 'BASH',
        terminalStartupDir: '/home/test',
        terminalStartupCommands: ['pwd', 'ls -l'],
        terminalWatchers: ['/home/test/first', '/home/test/second'],
      };

      TerminalService.createNewTerminalInstance(terminalData);
      TerminalService.killTerminalInstance('not-existing');
      expect(Terminal.prototype.dispose.calledOnce).to.be.equal(false);
      expect(virtualTerminalInstanceMock.kill.calledOnce).to.be.equal(false);
      expect(WatcherService.removeWatcher.calledOnce).to.be.equal(false);
    });
  });

  describe('hookTerminalToRenderer', () => {
    it('should hookup terminal instance to element if such terminal is registered', () => {
      sinonSandbox.stub(os, 'platform').returns('unix');
      const virtualTerminalInstanceMock = {
        write: sinonSandbox.stub().returns({}),
        on: sinonSandbox.stub().returns({}),
        resize: sinonSandbox.stub().returns({}),
      };
      const xTermInstance = {
        applyAddon: sinonSandbox.stub().returns({}),
        proposeGeometry: sinonSandbox.stub().returns({ rows: 20, cols: 50 }),
        fit: sinonSandbox.stub().returns({}),
        attachCustomKeyEventHandler: sinonSandbox.stub().returns({}),
        open: sinonSandbox.stub().returns({}),
      };
      sinonSandbox.stub(Terminal, 'applyAddon').returns(xTermInstance.applyAddon);
      sinonSandbox.stub(Terminal.prototype, 'proposeGeometry').returns(xTermInstance.proposeGeometry);
      sinonSandbox.stub(Terminal.prototype, 'fit').returns(xTermInstance.fit);
      sinonSandbox
        .stub(Terminal.prototype, 'attachCustomKeyEventHandler')
        .returns(xTermInstance.attachCustomKeyEventHandler);
      sinonSandbox.stub(Terminal.prototype, 'open').returns(xTermInstance.open);
      sinonSandbox.stub(pty, 'spawn').returns(virtualTerminalInstanceMock);
      const terminalData = {
        terminalType: 'BASH',
        terminalStartupDir: '/home/test',
        terminalStartupCommands: ['pwd', 'ls -l'],
        terminalWatchers: ['/home/test/first', '/home/test/second'],
      };

      const terminalId = TerminalService.createNewTerminalInstance(terminalData);
      TerminalService.hookTerminalToRenderer(terminalId, 'lul');
      expect(Terminal.prototype.proposeGeometry.calledOnce).to.be.equal(true);
      expect(Terminal.prototype.fit.calledOnce).to.be.equal(true);
      expect(Terminal.prototype.open.calledOnce).to.be.equal(true);
      expect(virtualTerminalInstanceMock.resize.calledOnce).to.be.equal(true);
      expect(virtualTerminalInstanceMock.resize.calledOnce).to.be.equal(true);
    });

    it('should not hookup terminal instance to element if terminal instance is not registered', () => {
      sinonSandbox.stub(os, 'platform').returns('unix');
      const virtualTerminalInstanceMock = {
        write: sinonSandbox.stub().returns({}),
        on: sinonSandbox.stub().returns({}),
        resize: sinonSandbox.stub().returns({}),
      };
      const xTermInstance = {
        applyAddon: sinonSandbox.stub().returns({}),
        proposeGeometry: sinonSandbox.stub().returns({ rows: 20, cols: 50 }),
        fit: sinonSandbox.stub().returns({}),
        attachCustomKeyEventHandler: sinonSandbox.stub().returns({}),
        open: sinonSandbox.stub().returns({}),
      };
      sinonSandbox.stub(Terminal, 'applyAddon').returns(xTermInstance.applyAddon);
      sinonSandbox.stub(Terminal.prototype, 'proposeGeometry').returns(xTermInstance.proposeGeometry);
      sinonSandbox.stub(Terminal.prototype, 'fit').returns(xTermInstance.fit);
      sinonSandbox
        .stub(Terminal.prototype, 'attachCustomKeyEventHandler')
        .returns(xTermInstance.attachCustomKeyEventHandler);
      sinonSandbox.stub(Terminal.prototype, 'open').returns(xTermInstance.open);
      sinonSandbox.stub(pty, 'spawn').returns(virtualTerminalInstanceMock);
      const terminalData = {
        terminalType: 'BASH',
        terminalStartupDir: '/home/test',
        terminalStartupCommands: ['pwd', 'ls -l'],
        terminalWatchers: ['/home/test/first', '/home/test/second'],
      };

      TerminalService.createNewTerminalInstance(terminalData);
      TerminalService.hookTerminalToRenderer('not-registered', 'lul');
      expect(Terminal.prototype.proposeGeometry.calledOnce).to.be.equal(false);
      expect(Terminal.prototype.fit.calledOnce).to.be.equal(false);
      expect(Terminal.prototype.open.calledOnce).to.be.equal(false);
      expect(virtualTerminalInstanceMock.resize.calledOnce).to.be.equal(false);
      expect(virtualTerminalInstanceMock.resize.calledOnce).to.be.equal(false);
    });
  });
});
