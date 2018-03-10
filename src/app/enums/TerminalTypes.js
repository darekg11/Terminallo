const TerminalTypes = {
  windows: {
    CMD: {
      name: 'CMD',
      label: 'CMD',
      start: 'cmd.exe',
    },
    POWERSHELL: {
      name: 'POWERSHELL',
      label: 'PowerShell',
      start: 'powershell.exe',
    },
  },
  unix: {},
};

export default TerminalTypes;
