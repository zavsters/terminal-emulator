# Terminal Emulator

A static website that behaves like a simplified terminal emulator inside the browser. Users can type commands, press Enter, and see output just like in a shell.

## Features

- **Fullscreen dark terminal interface** with monospace font
- **Blinking cursor** animation
- **Scrollable command history** - all previous commands and outputs remain visible
- **In-memory filesystem** - nested JavaScript object structure
- **6 supported commands:**
  - `pwd` - Print current working directory
  - `ls` - List files and folders in current directory
  - `cd <folder>` - Change directory (supports `cd ..`, absolute/relative paths)
  - `mkdir <folder>` - Create a new directory
  - `touch <file>` - Create a new file
  - `cat <file>` - Display file contents

## How to Use

1. Open `index.html` in your web browser
2. Type commands and press Enter to execute
3. Navigate the filesystem, create files and directories, and view file contents

## Example Usage

```bash
pwd
ls
mkdir test
cd test
touch file.txt
cat file.txt
cd ..
pwd
ls
```

## Technical Details

- **Pure vanilla HTML, CSS, and JavaScript** - no frameworks or dependencies
- **No backend required** - everything runs in the browser
- **In-memory filesystem** - data persists during the session but resets on page reload
- **Path resolution** - supports absolute paths (`/home`), relative paths (`test`), and parent directory navigation (`..`)

## File Structure

```
terminal-emulator/
├── index.html      # Main HTML structure
├── styles.css      # Terminal styling
├── script.js       # Filesystem and command logic
└── README.md       # This file
```

## Browser Support

Works in all modern browsers that support:
- ES6 JavaScript
- CSS3 animations
- Flexbox layout

