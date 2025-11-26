// Filesystem structure
let filesystem = {
    "/": {
        home: {},
        var: {},
        tmp: {}
    }
};

// Current working directory (absolute path)
let currentPath = "/";

// Get current directory object
function getCurrentDir() {
    if (currentPath === "/") {
        return filesystem["/"];
    }
    
    const pathParts = currentPath.split("/").filter(p => p);
    let dir = filesystem["/"];
    
    for (const part of pathParts) {
        if (part && dir[part] && typeof dir[part] === "object" && !dir[part].content) {
            dir = dir[part];
        } else {
            return null;
        }
    }
    return dir;
}

// Resolve path (absolute or relative)
function resolvePath(path) {
    if (!path) return currentPath;
    
    // Absolute path
    if (path.startsWith("/")) {
        return path === "/" ? "/" : path.replace(/\/+/g, "/").replace(/\/$/, "") || "/";
    }
    
    // Relative path
    const parts = currentPath === "/" ? [] : currentPath.split("/").filter(p => p);
    const newParts = path.split("/").filter(p => p);
    
    for (const part of newParts) {
        if (part === "..") {
            if (parts.length > 0) parts.pop();
        } else if (part !== ".") {
            parts.push(part);
        }
    }
    
    return parts.length === 0 ? "/" : "/" + parts.join("/");
}

// Check if path exists
function pathExists(path) {
    const resolved = resolvePath(path);
    if (resolved === "/") return true;
    
    const parts = resolved.split("/").filter(p => p);
    let dir = filesystem["/"];
    
    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (!dir[part]) return false;
        
        if (i === parts.length - 1) {
            return true;
        }
        
        if (typeof dir[part] === "object" && !dir[part].content) {
            dir = dir[part];
        } else {
            return false;
        }
    }
    return true;
}

// Check if path is a directory
function isDirectory(path) {
    const resolved = resolvePath(path);
    if (resolved === "/") return true;
    
    const parts = resolved.split("/").filter(p => p);
    let dir = filesystem["/"];
    
    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (!dir[part]) return false;
        
        if (i === parts.length - 1) {
            return typeof dir[part] === "object" && !dir[part].content;
        }
        
        if (typeof dir[part] === "object" && !dir[part].content) {
            dir = dir[part];
        } else {
            return false;
        }
    }
    return false;
}

// Get file/directory at path
function getPathObject(path) {
    const resolved = resolvePath(path);
    if (resolved === "/") return filesystem["/"];
    
    const parts = resolved.split("/").filter(p => p);
    let dir = filesystem["/"];
    
    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (!dir[part]) return null;
        
        if (i === parts.length - 1) {
            return dir[part];
        }
        
        if (typeof dir[part] === "object" && !dir[part].content) {
            dir = dir[part];
        } else {
            return null;
        }
    }
    return null;
}

// Get parent directory object
function getParentDir(path) {
    const resolved = resolvePath(path);
    if (resolved === "/") return null;
    
    const parts = resolved.split("/").filter(p => p);
    if (parts.length === 0) return filesystem["/"];
    
    const parentPath = "/" + parts.slice(0, -1).join("/");
    return getPathObject(parentPath) || filesystem["/"];
}

// DOM elements (will be initialized when DOM is ready)
let output;
let commandInput;

// Add output line
function addOutput(text, className = "") {
    if (!output) return;
    const line = document.createElement("div");
    line.className = "output-line " + className;
    line.textContent = text;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
}

// Clear output
function clearOutput() {
    if (!output) return;
    output.innerHTML = "";
}

// Command handlers
const commands = {
    pwd: () => {
        return currentPath;
    },
    
    ls: (args) => {
        const dir = getCurrentDir();
        if (!dir) {
            return "Error: Cannot access current directory";
        }
        
        const items = Object.keys(dir).sort();
        if (items.length === 0) {
            return "(empty)";
        }
        return items.join("  ");
    },
    
    cd: (args) => {
        if (!args || args.length === 0) {
            currentPath = "/";
            return "";
        }
        
        const target = args[0];
        const resolved = resolvePath(target);
        
        // Prevent going above root
        if (resolved === "" || resolved === "/") {
            currentPath = "/";
            return "";
        }
        
        if (!pathExists(resolved)) {
            return `cd: ${target}: No such file or directory`;
        }
        
        if (!isDirectory(resolved)) {
            return `cd: ${target}: Not a directory`;
        }
        
        currentPath = resolved;
        return "";
    },
    
    mkdir: (args) => {
        if (!args || args.length === 0) {
            return "mkdir: missing operand";
        }
        
        const dirName = args[0];
        
        // Validate folder name
        if (dirName.includes("/") || dirName === "" || dirName === "." || dirName === "..") {
            return `mkdir: cannot create directory '${dirName}': Invalid name`;
        }
        
        const currentDir = getCurrentDir();
        if (!currentDir) {
            return "Error: Cannot access current directory";
        }
        
        if (currentDir[dirName]) {
            return `mkdir: cannot create directory '${dirName}': File exists`;
        }
        
        currentDir[dirName] = {};
        return "";
    },
    
    touch: (args) => {
        if (!args || args.length === 0) {
            return "touch: missing file operand";
        }
        
        const fileName = args[0];
        
        // Validate file name
        if (fileName.includes("/") || fileName === "" || fileName === "." || fileName === "..") {
            return `touch: cannot create file '${fileName}': Invalid name`;
        }
        
        const currentDir = getCurrentDir();
        if (!currentDir) {
            return "Error: Cannot access current directory";
        }
        
        // Create file with empty content if it doesn't exist
        if (!currentDir[fileName]) {
            currentDir[fileName] = { content: "" };
        }
        
        return "";
    },
    
    cat: (args) => {
        if (!args || args.length === 0) {
            return "cat: missing file operand";
        }
        
        const fileName = args[0];
        const resolved = resolvePath(fileName);
        
        if (!pathExists(resolved)) {
            return `cat: ${fileName}: No such file or directory`;
        }
        
        const fileObj = getPathObject(resolved);
        
        // Check if it's a file (has content property) or directory
        if (typeof fileObj === "object" && !fileObj.content) {
            return `cat: ${fileName}: Is a directory`;
        }
        
        // Return file content
        return fileObj && fileObj.content !== undefined ? fileObj.content : "";
    },
    
    mario: () => {
        startMarioGame();
        return "";
    }
};

// Parse command input
function parseCommand(input) {
    const trimmed = input.trim();
    if (!trimmed) return null;
    
    const parts = trimmed.split(/\s+/);
    return {
        command: parts[0],
        args: parts.slice(1)
    };
}

// Execute command
function executeCommand(input) {
    const parsed = parseCommand(input);
    if (!parsed) return;
    
    // Display the command
    addOutput(`$ ${input}`);
    
    const { command, args } = parsed;
    
    if (commands[command]) {
        const result = commands[command](args);
        if (result !== "") {
            // Check if result is an error message
            const isError = result.startsWith("Error:") || 
                          result.includes(": No such file") || 
                          result.includes(": Not a directory") ||
                          result.includes(": File exists") ||
                          result.includes(": Invalid name") ||
                          result.includes(": Is a directory") ||
                          result.includes("missing operand") ||
                          result.includes("Command not found");
            addOutput(result, isError ? "error" : "");
        }
    } else {
        addOutput(`Command not found: ${command}`, "error");
    }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    // Get DOM elements
    output = document.getElementById("output");
    commandInput = document.getElementById("command-input");
    
    if (!output || !commandInput) {
        console.error("Terminal elements not found!");
        return;
    }
    
    // Handle input
    commandInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            const input = commandInput.value;
            executeCommand(input);
            commandInput.value = "";
        }
    });
    
    // Keep input focused
    commandInput.addEventListener("blur", () => {
        setTimeout(() => commandInput.focus(), 0);
    });
    
    // Initial welcome message
    addOutput("Terminal Emulator v1.0", "title");
    addOutput("Type commands to interact with the filesystem.");
    addOutput("Available commands: pwd, ls, cd, mkdir, touch, cat, mario");
    addOutput("");
});

// ==================== MARIO GAME ====================

// Game state
let marioGame = {
    running: false,
    animationId: null,
    keys: {},
    prevKeys: {}, // Track previous frame's key states
    canvas: null,
    ctx: null
};

// Game constants
const COLORS = {
    background: '#000000',
    sky: '#1a0033',
    skyDark: '#0d0019',
    ground: '#2a1a3d',
    mario: '#ff00ff',
    marioLight: '#ff66ff',
    marioDark: '#cc00cc',
    block: '#660066',
    blockBorder: '#880088',
    blockLight: '#990099',
    coin: '#ff66ff',
    coinDark: '#ff00ff',
    coinLight: '#ff99ff'
};

const PLAYER = {
    width: 20,
    height: 28,
    speed: 7,
    airSpeed: 5.5, // Slightly less control in air
    jumpPower: -14,
    gravity: 0.9,
    friction: 0.75,
    airFriction: 0.9, // Less friction in air
    maxSpeed: 10
};

const WORLD = {
    width: Infinity, // Neverending world
    groundHeight: 120,
    blockSize: 40,
    blockSpacing: 200, // Distance between blocks
    viewDistance: 1000 // How far ahead to generate blocks
};

// Player state
let player = {
    x: 100,
    y: 0,
    vx: 0,
    vy: 0,
    onGround: false,
    facing: 1, // 1 = right, -1 = left
    canDoubleJump: false, // Track if double jump is available
    hasDoubleJumped: false // Track if double jump was used
};

// Camera
let camera = {
    x: 0
};

// Blocks/platforms (dynamically generated)
let blocks = [];
let lastBlockX = 0; // Track where we last generated a block

// Coins (dynamically generated)
let coins = [];
let lastCoinX = 0; // Track where we last generated a coin
let score = 0; // Player score

// Initialize game
function startMarioGame() {
    const terminal = document.getElementById("terminal");
    const gameContainer = document.getElementById("mario-game");
    const canvas = document.getElementById("game-canvas");
    
    // Hide terminal, show game
    terminal.classList.add("hidden");
    gameContainer.classList.remove("hidden");
    
    // Setup canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    
    marioGame.canvas = canvas;
    marioGame.ctx = ctx;
    marioGame.prevKeys = {}; // Initialize previous keys
    
    // Reset player
    player.x = 100;
    player.y = canvas.height - WORLD.groundHeight - PLAYER.height;
    player.vx = 0;
    player.vy = 0;
    player.onGround = false;
    player.facing = 1;
    player.canDoubleJump = true;
    player.hasDoubleJumped = false;
    
    // Initialize blocks array and generate initial blocks
    blocks = [];
    lastBlockX = 0;
    generateInitialBlocks(canvas.height - WORLD.groundHeight);
    
    // Initialize coins array and generate initial coins
    coins = [];
    lastCoinX = 0;
    score = 0;
    generateInitialCoins(canvas.height - WORLD.groundHeight);
    
    // Reset camera
    camera.x = 0;
    
    // Setup input
    setupGameInput();
    
    // Start game loop
    marioGame.running = true;
    gameLoop();
}

// Game input handlers
let gameKeyDownHandler = null;
let gameKeyUpHandler = null;

function setupGameInput() {
    marioGame.keys = {};
    
    gameKeyDownHandler = (e) => {
        if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === " " || e.key === "Escape") {
            e.preventDefault();
        }
        
        if (e.key === "ArrowLeft") marioGame.keys.left = true;
        if (e.key === "ArrowRight") marioGame.keys.right = true;
        if (e.key === " ") marioGame.keys.space = true;
        if (e.key === "Escape") {
            exitMarioGame();
        }
    };
    
    gameKeyUpHandler = (e) => {
        if (e.key === "ArrowLeft") marioGame.keys.left = false;
        if (e.key === "ArrowRight") marioGame.keys.right = false;
        if (e.key === " ") marioGame.keys.space = false;
    };
    
    window.addEventListener("keydown", gameKeyDownHandler);
    window.addEventListener("keyup", gameKeyUpHandler);
}

// Exit game
function exitMarioGame() {
    if (!marioGame.running) return;
    
    marioGame.running = false;
    if (marioGame.animationId) {
        cancelAnimationFrame(marioGame.animationId);
        marioGame.animationId = null;
    }
    
    // Remove event listeners
    if (gameKeyDownHandler) {
        window.removeEventListener("keydown", gameKeyDownHandler);
        gameKeyDownHandler = null;
    }
    if (gameKeyUpHandler) {
        window.removeEventListener("keyup", gameKeyUpHandler);
        gameKeyUpHandler = null;
    }
    
    // Hide game, show terminal
    const terminal = document.getElementById("terminal");
    const gameContainer = document.getElementById("mario-game");
    
    gameContainer.classList.add("hidden");
    terminal.classList.remove("hidden");
    
    // Refocus terminal input
    if (commandInput) {
        commandInput.focus();
    } else {
        const cmdInput = document.getElementById("command-input");
        if (cmdInput) cmdInput.focus();
    }
}

// Generate initial blocks
function generateInitialBlocks(groundY) {
    // Generate blocks starting from x=400, spaced every 200px
    for (let x = 400; x < 2000; x += WORLD.blockSpacing) {
        const height = 60 + Math.random() * 80; // Random height between 60-140px above ground
        blocks.push({
            x: x,
            y: groundY - height,
            width: 80,
            height: 40
        });
        lastBlockX = x;
    }
}

// Generate new blocks ahead of player
function generateBlocksAhead(groundY) {
    const canvas = marioGame.canvas;
    const playerRightEdge = player.x + WORLD.viewDistance;
    
    // Generate blocks until we're ahead of the view distance
    while (lastBlockX < playerRightEdge) {
        lastBlockX += WORLD.blockSpacing + (Math.random() * 100 - 50); // Slight randomness in spacing
        
        // 80% chance to generate a block (occasional gaps)
        if (Math.random() > 0.2) {
            const height = 60 + Math.random() * 80; // Random height between 60-140px above ground
            const width = 60 + Math.random() * 40; // Random width between 60-100px
            blocks.push({
                x: lastBlockX,
                y: groundY - height,
                width: width,
                height: 40
            });
        }
    }
}

// Remove blocks that are too far behind
function removeOldBlocks() {
    const removeDistance = 300; // Remove blocks this far behind camera
    blocks = blocks.filter(block => block.x > camera.x - removeDistance);
}

// Generate initial coins
function generateInitialCoins(groundY) {
    // Generate coins starting from x=300, spaced every 150-250px
    for (let x = 300; x < 2000; x += 150 + Math.random() * 100) {
        // 60% chance to generate a coin
        if (Math.random() > 0.4) {
            const height = 80 + Math.random() * 100; // Random height between 80-180px above ground
            const coinY = groundY - height;
            const coinRadius = 12;
            
            // Check if coin overlaps with any block, if so, try a different height
            let attempts = 0;
            let finalY = coinY;
            while (coinOverlapsBlock(x, finalY, coinRadius) && attempts < 10) {
                finalY = groundY - (80 + Math.random() * 100);
                attempts++;
            }
            
            // Only add coin if it doesn't overlap with blocks
            if (!coinOverlapsBlock(x, finalY, coinRadius)) {
                coins.push({
                    x: x,
                    y: finalY,
                    radius: coinRadius,
                    collected: false
                });
                lastCoinX = x;
            }
        }
    }
}

// Generate new coins ahead of player
function generateCoinsAhead(groundY) {
    const canvas = marioGame.canvas;
    const playerRightEdge = player.x + WORLD.viewDistance;
    
    // Generate coins until we're ahead of the view distance
    while (lastCoinX < playerRightEdge) {
        lastCoinX += 150 + Math.random() * 100; // Random spacing
        
        // 60% chance to generate a coin
        if (Math.random() > 0.4) {
            const height = 80 + Math.random() * 100; // Random height between 80-180px above ground
            const coinY = groundY - height;
            const coinRadius = 12;
            
            // Check if coin overlaps with any block, if so, try a different height
            let attempts = 0;
            let finalY = coinY;
            while (coinOverlapsBlock(lastCoinX, finalY, coinRadius) && attempts < 10) {
                finalY = groundY - (80 + Math.random() * 100);
                attempts++;
            }
            
            // Only add coin if it doesn't overlap with blocks
            if (!coinOverlapsBlock(lastCoinX, finalY, coinRadius)) {
                coins.push({
                    x: lastCoinX,
                    y: finalY,
                    radius: coinRadius,
                    collected: false
                });
            }
        }
    }
}

// Remove coins that are too far behind or collected
function removeOldCoins() {
    const removeDistance = 300; // Remove coins this far behind camera
    coins = coins.filter(coin => !coin.collected && coin.x > camera.x - removeDistance);
}

// Check if coin position overlaps with any block
function coinOverlapsBlock(coinX, coinY, coinRadius) {
    for (const block of blocks) {
        // Check if coin overlaps with block (circle-rectangle collision)
        const closestX = Math.max(block.x, Math.min(coinX, block.x + block.width));
        const closestY = Math.max(block.y, Math.min(coinY, block.y + block.height));
        const dx = coinX - closestX;
        const dy = coinY - closestY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < coinRadius) {
            return true;
        }
    }
    return false;
}

// Check coin collection
function checkCoinCollection() {
    coins.forEach(coin => {
        if (!coin.collected) {
            // Simple circle-rectangle collision
            const playerCenterX = player.x + PLAYER.width / 2;
            const playerCenterY = player.y + PLAYER.height / 2;
            const dx = playerCenterX - coin.x;
            const dy = playerCenterY - coin.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < coin.radius + Math.max(PLAYER.width, PLAYER.height) / 2) {
                coin.collected = true;
                score++;
            }
        }
    });
}

// Update physics
function updatePhysics() {
    const canvas = marioGame.canvas;
    const groundY = canvas.height - WORLD.groundHeight;
    
    // Generate new blocks and remove old ones
    generateBlocksAhead(groundY);
    removeOldBlocks();
    
    // Generate new coins and remove old ones
    generateCoinsAhead(groundY);
    removeOldCoins();
    
    // Check coin collection
    checkCoinCollection();
    
    // Horizontal movement (different speeds for ground vs air)
    const moveSpeed = player.onGround ? PLAYER.speed : PLAYER.airSpeed;
    
    if (marioGame.keys.left) {
        player.vx -= moveSpeed;
        player.facing = -1;
    }
    if (marioGame.keys.right) {
        player.vx += moveSpeed;
        player.facing = 1;
    }
    
    // Apply friction (different for ground vs air, only when not pressing movement keys)
    if (!marioGame.keys.left && !marioGame.keys.right) {
        const friction = player.onGround ? PLAYER.friction : PLAYER.airFriction;
        player.vx *= friction;
    }
    
    // Limit max speed
    if (Math.abs(player.vx) > PLAYER.maxSpeed) {
        player.vx = player.vx > 0 ? PLAYER.maxSpeed : -PLAYER.maxSpeed;
    }
    
    // Jump (single or double) - only trigger on key press, not while held
    const spaceJustPressed = marioGame.keys.space && !marioGame.prevKeys.space;
    
    if (spaceJustPressed) {
        if (player.onGround) {
            // Regular jump from ground - don't affect horizontal velocity
            player.vy = PLAYER.jumpPower;
            player.onGround = false;
            player.canDoubleJump = true;
            player.hasDoubleJumped = false;
        } else if (player.canDoubleJump && !player.hasDoubleJumped) {
            // Double jump in air - preserve horizontal momentum
            player.vy = PLAYER.jumpPower;
            player.hasDoubleJumped = true;
            player.canDoubleJump = false;
        }
    }
    
    // Save current key states for next frame
    marioGame.prevKeys = { ...marioGame.keys };
    
    // Reset double jump when on ground
    if (player.onGround) {
        player.canDoubleJump = true;
        player.hasDoubleJumped = false;
    }
    
    // Gravity
    if (!player.onGround) {
        player.vy += PLAYER.gravity;
    }
    
    // Update position
    player.x += player.vx;
    player.y += player.vy;
    
    // Ground collision
    const playerBottom = player.y + PLAYER.height;
    if (playerBottom >= groundY) {
        player.y = groundY - PLAYER.height;
        player.vy = 0;
        player.onGround = true;
    } else {
        player.onGround = false;
    }
    
    // Block collisions
    blocks.forEach(block => {
        if (checkCollision(player, block)) {
            // Top collision (landing on block)
            if (player.vy > 0 && player.y < block.y && player.y + PLAYER.height > block.y) {
                player.y = block.y - PLAYER.height;
                player.vy = 0;
                player.onGround = true;
            }
            // Side collisions
            else if (player.vx > 0 && player.x < block.x + block.width && player.x + PLAYER.width > block.x) {
                player.x = block.x - PLAYER.width;
                player.vx = 0;
            }
            else if (player.vx < 0 && player.x < block.x + block.width && player.x + PLAYER.width > block.x) {
                player.x = block.x + block.width;
                player.vx = 0;
            }
        }
    });
    
    // Update camera to follow player (infinite world, no upper limit)
    camera.x = player.x - canvas.width / 3;
    if (camera.x < 0) camera.x = 0;
}

// Check collision between player and block
function checkCollision(player, block) {
    return player.x < block.x + block.width &&
           player.x + PLAYER.width > block.x &&
           player.y < block.y + block.height &&
           player.y + PLAYER.height > block.y;
}

// Draw everything
function draw() {
    const ctx = marioGame.ctx;
    const canvas = marioGame.canvas;
    
    // Clear canvas
    ctx.fillStyle = COLORS.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw sky gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height - WORLD.groundHeight);
    gradient.addColorStop(0, COLORS.sky);
    gradient.addColorStop(1, COLORS.skyDark);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height - WORLD.groundHeight);
    
    // Draw ground
    ctx.fillStyle = COLORS.ground;
    ctx.fillRect(0, canvas.height - WORLD.groundHeight, canvas.width, WORLD.groundHeight);
    
    // Draw ground pattern (simple lines for texture)
    ctx.strokeStyle = COLORS.block;
    ctx.lineWidth = 2;
    for (let i = 0; i < canvas.width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i - camera.x, canvas.height - WORLD.groundHeight);
        ctx.lineTo(i - camera.x, canvas.height);
        ctx.stroke();
    }
    
    // Draw blocks
    blocks.forEach(block => {
        const blockX = block.x - camera.x;
        const blockY = block.y;
        
        // Only draw if visible
        if (blockX + block.width > 0 && blockX < canvas.width) {
            // Block shadow
            ctx.fillStyle = COLORS.block;
            ctx.fillRect(blockX + 2, blockY + 2, block.width, block.height);
            
            // Block main
            ctx.fillStyle = COLORS.blockBorder;
            ctx.fillRect(blockX, blockY, block.width, block.height);
            
            // Block highlight
            ctx.fillStyle = COLORS.blockLight;
            ctx.fillRect(blockX, blockY, block.width, 4);
            ctx.fillRect(blockX, blockY, 4, block.height);
        }
    });
    
    // Draw coins (pixelated 8-bit style - square coins)
    coins.forEach(coin => {
        if (!coin.collected) {
            const coinX = Math.round(coin.x - camera.x);
            const coinY = Math.round(coin.y);
            const coinSize = coin.radius * 2;
            
            // Only draw if visible
            if (coinX + coinSize > 0 && coinX - coinSize < canvas.width) {
                // Shadow (darker pink, offset)
                ctx.fillStyle = COLORS.coinDark;
                ctx.fillRect(coinX - coinSize/2 + 1, coinY - coinSize/2 + 1, coinSize, coinSize);
                
                // Main coin body (bright pink)
                ctx.fillStyle = COLORS.coin;
                ctx.fillRect(coinX - coinSize/2, coinY - coinSize/2, coinSize, coinSize);
                
                // Highlight (light pink, top-left corner)
                ctx.fillStyle = COLORS.coinLight;
                ctx.fillRect(coinX - coinSize/2, coinY - coinSize/2, coinSize/2, coinSize/2);
                
                // Center dot (darker pink)
                ctx.fillStyle = COLORS.coinDark;
                ctx.fillRect(coinX - 2, coinY - 2, 4, 4);
            }
        }
    });
    
    // Draw player (8-bit Mario)
    const playerX = player.x - camera.x;
    const playerY = player.y;
    
    // Only draw if visible
    if (playerX + PLAYER.width > 0 && playerX < canvas.width) {
        // Shadow
        ctx.fillStyle = COLORS.marioDark;
        ctx.fillRect(playerX + 1, playerY + 1, PLAYER.width, PLAYER.height);
        
        // Body (main rectangle)
        ctx.fillStyle = COLORS.mario;
        ctx.fillRect(playerX, playerY, PLAYER.width, PLAYER.height);
        
        // Head (smaller rectangle on top)
        ctx.fillStyle = COLORS.marioLight;
        ctx.fillRect(playerX + 4, playerY, 12, 10);
        
        // Eyes
        ctx.fillStyle = COLORS.background;
        ctx.fillRect(playerX + 6, playerY + 3, 2, 2);
        ctx.fillRect(playerX + 12, playerY + 3, 2, 2);
        
        // Hat
        ctx.fillStyle = COLORS.marioDark;
        ctx.fillRect(playerX + 2, playerY - 2, 16, 4);
        
        // Arms
        ctx.fillStyle = COLORS.mario;
        ctx.fillRect(playerX - 2, playerY + 8, 4, 8);
        ctx.fillRect(playerX + PLAYER.width - 2, playerY + 8, 4, 8);
        
        // Legs
        ctx.fillStyle = COLORS.marioDark;
        ctx.fillRect(playerX + 4, playerY + PLAYER.height - 6, 4, 6);
        ctx.fillRect(playerX + 12, playerY + PLAYER.height - 6, 4, 6);
    }
    
    // Draw score (prominent display with terminal font)
    // Score background for better visibility
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(15, 20, 150, 30);
    
    // Score text with terminal font
    ctx.fillStyle = '#ffffff';
    ctx.font = '24px "Courier New", "Monaco", "Menlo", monospace';
    ctx.fillText(`Coins: ${score}`, 20, 45);
}

// Game loop
function gameLoop() {
    if (!marioGame.running) return;
    
    updatePhysics();
    draw();
    
    marioGame.animationId = requestAnimationFrame(gameLoop);
}

// Handle window resize
window.addEventListener("resize", () => {
    if (marioGame.running && marioGame.canvas) {
        marioGame.canvas.width = window.innerWidth;
        marioGame.canvas.height = window.innerHeight;
        marioGame.ctx.imageSmoothingEnabled = false;
    }
});

