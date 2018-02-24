import { expect } from 'chai';
import 'chai/register-should';
import * as TerminalService from '../../app/services/TerminalService';

describe('Terminal service', () => {
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
          uuid: '1234abcd',
          terminalType: 'CMD',
          terminalName: 'Test 1',
          terminalStartupDir: '../someDir/dir1',
          terminalStartupCommands: ['cd ..', 'cd ..'],
        },
        {
          uuid: '1234abcd5678',
          terminalType: 'CMD',
          terminalName: 'Test 2',
          terminalStartupDir: '../someDir/dir2',
          terminalStartupCommands: ['cd ..', 'cd ..', 'cd dir', 'ls'],
        },
      ];
      const result = TerminalService.exportTermninalsToObject(input);
      const expectedResult = {
        terminals: [
          {
            uuid: '1234abcd',
            terminalType: 'CMD',
            name: 'Test 1',
            terminalStartupDir: '../someDir/dir1',
            terminalStartupCommands: ['cd ..', 'cd ..'],
          },
          {
            uuid: '1234abcd5678',
            terminalType: 'CMD',
            name: 'Test 2',
            terminalStartupDir: '../someDir/dir2',
            terminalStartupCommands: ['cd ..', 'cd ..', 'cd dir', 'ls'],
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
    });
  });
});
