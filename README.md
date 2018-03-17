# Terminallo

### What is Terminallo:

**Terminallo** is a simple Electron based application that allows user to manage multiple terminal windows in single application including quickly export to file and quickly import consoles back up.  
Terminallo allows you to specify commands that should be run before each console is available therefore this is great tool to quickly boot up saved terminals without need to manually enter commands everytime you need to start work.

### Motivation behind developing another yet terminal manager:

I needed application for Windows that would let me manage multiple terminals in single window (several of those already exist for Windows) with support of executing commands defined by me automatically after terminal boots up.  
Also, for fun.

### Limitations of Terminallo:

For now it is only supports terminals for **Windows** (Pull requests are more than welcome) including:

1.  **Classic CMD**
2.  **PowerShell**

### Features:

1.  Need to quickly boot up 20 terminals with predefined, different commands for each one?  
    No problem, just create them in Terminallo, export them to readable **JSON** file and import them when you need to start your work again:  
     **Create and export:**  
     ![Create and export terminals](https://media.giphy.com/media/3M8bF6DMTv74NtuH92/giphy.gif)  
     **Import:**  
     ![Importing terminals](https://media.giphy.com/media/biKaxo5y9utw3MOGN4/giphy.gif)

### Keyboard shortcuts:

`Command / CTRL + P` - stops currently executing process in currently selected terminal (`sends SIGTERM signal`)  
`Command / CTRL + R` - reloads currently selected terminal (killing terminal instance and recreating it, including executing predefined commands)  
`Command / CTRL + D` - removes currently selected terminal instance  
`Command / CTRL + E` - brings up edit form for currently selected terminal instance  
`Command / CTRL + ->` - swap places currently selected terminal instance with the next one (changing order)  
`Command / CTRL + <-` - swap places currently selected terminal instance with the previous one (changing order)  
`ALT + ->` - go to next terminal instance in order  
`ALT + <-` - go to previous terminal instance in order  
`Command / CTRL + S` - saves terminal instances

# Development

1.  Running **Terminallo** locally:  
    **Beware**: You need to have fully working **node-gyp** module installed (Please see [Help on node-gyp repo](https://github.com/nodejs/node-gyp))

    1.  `git clone` this repo
    2.  Launch `npm_install.sh`, it will install all dependencies and build `node-pty` module for required `Electron` version
    3.  Execute `npm run watch` to luanch webpack dev server
    4.  Execute `npm start` to launch **Terminallo** in dev mode with hot-replacement based on running webpack instance

2.  Run unit tests and generate code coverage:
    1.  Execute `npm test`
    2.  Code Coverage generated by Istanbul is going to be located in `coverage` directory

**Have any idea, feature to add or bug to fix?  
Go ahead and create Pull Requests, contribution is welcome**

# Roadmap for version 1.1.0

- [ ] Bump `Electron` version to more recent version
- [ ] Bump code coverage to ~80%
- [x] Get rid of nasty `82vh` [hack for terminal dynamic height](https://github.com/darekg11/Terminallo/blob/master/src/app/components/Terminal/Terminal.css#L127) [Done as part of this PR](https://github.com/darekg11/Terminallo/pull/27)
- [x] Unify `Electron` modal dialog window mechanism in order to remove multiple code copy-pastas [Done as part of this PR](https://github.com/darekg11/Terminallo/pull/26)
- [ ] Allow for simultaneously stream of console output to file and console window
- [ ] Automatic terminal reload after detection of changes in selected directories (`watch on multiple directories`)
