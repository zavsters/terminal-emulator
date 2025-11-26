# Terminal Emulator - Action Plan

## Overview
Create a static website that behaves like a simplified terminal emulator inside the browser, with an in-memory filesystem supporting basic shell commands.

---

## Phase 1: Project Setup & Structure

### 1.1 File Structure
- [ ] Create/update `index.html` - Main HTML structure
- [ ] Create/update `styles.css` - Terminal styling
- [ ] Create/update `script.js` - Core functionality
- [ ] Ensure all files are in the same directory (static website requirement)

### 1.2 HTML Structure (`index.html`)
- [ ] Basic HTML5 document structure
- [ ] Link to `styles.css` and `script.js`
- [ ] Create container div for terminal
- [ ] Create output/history container (scrollable)
- [ ] Create input line container with prompt
- [ ] Ensure fullscreen layout capability

---

## Phase 2: UI Implementation (CSS)

### 2.1 Fullscreen Dark Background
- [ ] Set `body` and `html` to fullscreen (100vh, 100vw)
- [ ] Dark background color (e.g., `#1e1e1e` or `#0d1117`)
- [ ] Remove default margins/padding
- [ ] Set monospace font family (e.g., `'Courier New', monospace`)

### 2.2 Terminal Container
- [ ] Fullscreen container with dark background
- [ ] Padding for terminal margins
- [ ] Flexbox or grid layout for output area and input line

### 2.3 Output/History Area
- [ ] Scrollable container for command history
- [ ] Auto-scroll to bottom on new output
- [ ] Monospace font
- [ ] Text color (e.g., light green `#00ff00` or white `#ffffff`)
- [ ] Line spacing for readability
- [ ] Overflow handling (scrollbar styling)

### 2.4 Input Line & Prompt
- [ ] Fixed position at bottom or inline with output
- [ ] Prompt styling (e.g., `$ ` or `user@host:~$ `)
- [ ] Input field styling (transparent background, matching text color)
- [ ] Remove default input borders/outlines
- [ ] Ensure input is always focused/visible

### 2.5 Blinking Cursor
- [ ] CSS animation for cursor blink
- [ ] Use `@keyframes` with opacity toggle
- [ ] Apply to cursor element (can be `::after` pseudo-element or separate span)
- [ ] Blink rate: ~1 second cycle (500ms on, 500ms off)

---

## Phase 3: Filesystem Model (JavaScript)

### 3.1 Filesystem Data Structure
- [ ] Create initial filesystem object
- [ ] Structure: `{ "/": { home: {}, var: {}, tmp: {} } }`
- [ ] Store current working directory path (string)
- [ ] Initialize at root (`"/"`)

### 3.2 Filesystem Helper Functions
- [ ] `getCurrentDir()` - Returns current directory object
- [ ] `resolvePath(path)` - Resolves relative/absolute paths
- [ ] `pathExists(path)` - Checks if path exists
- [ ] `isDirectory(path)` - Checks if path is a directory
- [ ] `isFile(path)` - Checks if path is a file
- [ ] `getParentDir(path)` - Gets parent directory object

### 3.3 Path Resolution Logic
- [ ] Handle absolute paths (starting with `/`)
- [ ] Handle relative paths (relative to current directory)
- [ ] Handle `..` (parent directory)
- [ ] Handle `.` (current directory)
- [ ] Handle multiple slashes and normalization

---

## Phase 4: Command Implementation

### 4.1 Command Parser
- [ ] Parse input string into command and arguments
- [ ] Split by spaces (handle quoted strings if needed)
- [ ] Extract command name (first token)
- [ ] Extract arguments (remaining tokens)
- [ ] Trim whitespace

### 4.2 Command Router
- [ ] Create command handler object/map
- [ ] Route commands to appropriate handler functions
- [ ] Handle unknown commands with error message

### 4.3 `pwd` Command
- [ ] Return current working directory path
- [ ] Display as string (e.g., `/home` or `/`)
- [ ] Output to terminal

### 4.4 `ls` Command
- [ ] Get current directory contents
- [ ] List all keys in current directory object
- [ ] Format output (one per line or columns)
- [ ] Distinguish files from directories (optional: add `/` suffix to dirs)
- [ ] Handle empty directory

### 4.5 `cd` Command
- [ ] Parse target directory argument
- [ ] Resolve path (handle `..`, `.`, absolute, relative)
- [ ] Validate path exists and is a directory
- [ ] Update current working directory
- [ ] Handle errors:
  - Directory doesn't exist
  - Path is a file (not a directory)
  - No argument (stay in current directory or go to home)
- [ ] Support `cd ..` to go to parent
- [ ] Support `cd /` to go to root

### 4.6 `mkdir` Command
- [ ] Parse folder name argument
- [ ] Validate folder name (no slashes, not empty)
- [ ] Check if folder already exists
- [ ] Create new empty object in current directory
- [ ] Handle errors:
  - Folder already exists
  - Invalid folder name
  - No argument provided

### 4.7 `touch` Command
- [ ] Parse file name argument
- [ ] Validate file name (no slashes, not empty)
- [ ] Check if file already exists (optional: update timestamp or do nothing)
- [ ] Create new file entry (empty string `""` or object with content property)
- [ ] Handle errors:
  - File already exists (optional: allow overwrite or show error)
  - Invalid file name
  - No argument provided

### 4.8 `cat` Command
- [ ] Parse file name argument
- [ ] Resolve file path (current directory or absolute)
- [ ] Check if file exists
- [ ] Check if path is a file (not a directory)
- [ ] Display file contents
- [ ] Handle errors:
  - File doesn't exist
  - Path is a directory (not a file)
  - No argument provided

---

## Phase 5: Terminal Interaction

### 5.1 Input Handling
- [ ] Capture Enter key press
- [ ] Get input value
- [ ] Clear input field after submission
- [ ] Maintain focus on input field

### 5.2 Command Execution Flow
- [ ] Display user's command in output (with prompt)
- [ ] Execute command
- [ ] Display command output
- [ ] Display error messages (if any)
- [ ] Add new prompt line for next command

### 5.3 Output Formatting
- [ ] Preserve newlines in output
- [ ] Format error messages (e.g., red text or prefix with "Error:")
- [ ] Consistent spacing between commands
- [ ] Terminal-like formatting (monospace, proper line breaks)

### 5.4 History Management
- [ ] Store command history (optional: for up/down arrow navigation)
- [ ] Display all previous commands and outputs
- [ ] Auto-scroll to bottom when new output is added

### 5.5 Edge Cases
- [ ] Handle empty input (do nothing or show error)
- [ ] Handle whitespace-only input
- [ ] Handle special characters in file/folder names
- [ ] Prevent navigation above root (`/`)
- [ ] Handle invalid command syntax

---

## Phase 6: Polish & Testing

### 6.1 Visual Polish
- [ ] Ensure cursor is visible and blinking correctly
- [ ] Test scrolling behavior
- [ ] Verify fullscreen layout works
- [ ] Check text readability (contrast)
- [ ] Ensure prompt is always visible

### 6.2 Functional Testing
- [ ] Test all commands individually
- [ ] Test command combinations (e.g., `mkdir test`, `cd test`, `pwd`)
- [ ] Test edge cases:
  - `cd` to non-existent directory
  - `cat` on non-existent file
  - `mkdir` with existing name
  - `touch` with existing name
  - `cd ..` at root
  - Empty commands
- [ ] Test path resolution:
  - Absolute paths
  - Relative paths
  - `..` navigation
  - `.` references

### 6.3 Browser Compatibility
- [ ] Test in Chrome/Edge
- [ ] Test in Firefox
- [ ] Test in Safari
- [ ] Ensure no page reloads occur
- [ ] Verify vanilla JS (no frameworks)

### 6.4 Code Quality
- [ ] Clean, readable code structure
- [ ] Comments for complex logic
- [ ] Consistent naming conventions
- [ ] No console errors
- [ ] Efficient filesystem operations

---

## Phase 7: Optional Enhancements (If Time Permits)

### 7.1 User Experience
- [ ] Command history navigation (up/down arrows)
- [ ] Tab completion (optional)
- [ ] Clear command (`clear` or `Ctrl+L`)
- [ ] Help command (`help` or `--help`)

### 7.2 Filesystem Features
- [ ] File content editing (via `echo` or `nano`-like command)
- [ ] `rm` command (remove files/directories)
- [ ] `mv` command (move/rename)
- [ ] `cp` command (copy)
- [ ] `find` command (search files)

### 7.3 Visual Enhancements
- [ ] Color-coded output (errors in red, success in green)
- [ ] Syntax highlighting for file contents
- [ ] Multiple terminal themes
- [ ] Font size customization

---

## Implementation Order Recommendation

1. **Start with UI** (Phases 1-2): Get the visual terminal working first
2. **Basic Filesystem** (Phase 3): Implement the data structure and helpers
3. **Simple Commands** (Phase 4.1-4.4): `pwd`, `ls` first (easiest)
4. **Navigation** (Phase 4.5): `cd` command
5. **File Creation** (Phase 4.6-4.7): `mkdir`, `touch`
6. **File Reading** (Phase 4.8): `cat` command
7. **Integration** (Phase 5): Wire everything together
8. **Testing & Polish** (Phase 6): Fix bugs and improve UX

---

## Key Technical Considerations

### Filesystem Representation
```javascript
// Example structure:
{
  "/": {
    home: {
      user: {
        documents: {},
        "readme.txt": "Welcome to the terminal!"
      }
    },
    var: {},
    tmp: {}
  }
}
```

### Path Resolution
- Current directory: `/home/user`
- `cd documents` → `/home/user/documents`
- `cd ..` → `/home/user` → `/home`
- `cd /var` → `/var`
- `cd ../tmp` → `/tmp`

### Error Handling
- All commands should validate inputs
- Provide clear error messages
- Don't crash on invalid input
- Maintain terminal state (don't break filesystem)

---

## Success Criteria

✅ Fullscreen dark terminal interface  
✅ Blinking cursor  
✅ Scrollable command history  
✅ All 6 commands working (`pwd`, `ls`, `cd`, `mkdir`, `touch`, `cat`)  
✅ In-memory filesystem persists during session  
✅ No page reloads  
✅ Vanilla HTML/CSS/JS only  
✅ Terminal-like behavior and formatting  

---

## Estimated Time Breakdown

- Phase 1-2 (Setup & UI): 2-3 hours
- Phase 3 (Filesystem): 1-2 hours
- Phase 4 (Commands): 3-4 hours
- Phase 5 (Integration): 1-2 hours
- Phase 6 (Testing): 1-2 hours
- **Total: 8-13 hours**

---

## Notes

- Keep it simple initially - get basic functionality working first
- Test incrementally after each command implementation
- Use console.log for debugging during development
- Remember: files are just empty strings or objects with content
- Directories are objects containing other files/directories
- Root directory (`/`) is special - it's the top level

