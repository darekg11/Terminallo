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
  unix: {
    BASH: {
      name: 'BASH',
      label: 'Bash',
      start: 'bash',
    },
  },
};

export default TerminalTypes;
