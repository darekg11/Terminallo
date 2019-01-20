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
      label: 'bash',
      start: 'bash',
    },
    ZSH: {
      name: 'ZSH',
      label: 'zsh',
      start: 'zsh',
    },
  },
};

export default TerminalTypes;
