// SynthStellar Beat Game - game.js

// Phaser Game Configuration
const config = {
    type: Phaser.AUTO, // Automatically choose WebGL or Canvas
    width: 800,        // Game width in pixels
    height: 600,       // Game height in pixels
    parent: 'game-container', // ID of the DOM element to parent the game canvas (optional, but good practice)
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: { // Optional: if you need physics later
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }, // No gravity for a top-down or rhythm game
            debug: false
        }
    },
    backgroundColor: '#1a1a1a' // A dark background color
};

// Create a new Phaser game instance
const game = new Phaser.Game(config);

// Preload function: runs once, loads assets
function preload() {
    // Example: this.load.image('sky', 'assets/sky.png');
    // We will add asset loading here later
    console.log("Preloading assets...");
}

// Create function: runs once after preload, sets up the game
let notesGroup;
let spawnTimer;
let keys; // To hold keyboard input objects
let score = 0;
let scoreText;
let judgmentLineY; // To be accessible in update()
let gameState; // 'playing', 'ending', 'finished'
let gameEndTimer;

// Judgment windows (in pixels from the judgment line)
const judgmentWindows = {
    PERFECT: 20,
    GREAT: 40,
    GOOD: 60,
    MISS: 80 // Notes beyond this are considered a miss
};
const laneKeys = ['D', 'F', 'J', 'K']; // Define keys for lanes

function create() {
    console.log("Game created!");
    this.input.keyboard.removeAllListeners(); // Clean up listeners from previous game

    gameState = 'playing';
    score = 0; // Reset score on restart

    // --- Game Layout Constants ---
    const gameWidth = this.sys.game.config.width;
    const gameHeight = this.sys.game.config.height;
    const numLanes = 4;
    const laneWidth = 100;
    const playfieldWidth = numLanes * laneWidth;
    const playfieldStartX = (gameWidth - playfieldWidth) / 2;
        judgmentLineY = gameHeight - 100;

    // --- Draw Playfield ---
    const graphics = this.add.graphics();

    // Draw lane separators
    graphics.lineStyle(2, 0x555555); // 2px thick, gray lines
    for (let i = 0; i <= numLanes; i++) {
        const x = playfieldStartX + i * laneWidth;
        graphics.beginPath();
        graphics.moveTo(x, 0);
        graphics.lineTo(x, gameHeight);
        graphics.closePath();
        graphics.strokePath();
    }

    // Draw judgment line
    graphics.lineStyle(4, 0xff0000); // 4px thick, red line
    graphics.beginPath();
    graphics.moveTo(playfieldStartX, judgmentLineY);
    graphics.lineTo(playfieldStartX + playfieldWidth, judgmentLineY);
    graphics.closePath();
    graphics.strokePath();

    // Add a text label for the judgment line (optional)
    this.add.text(playfieldStartX - 10, judgmentLineY, 'PERFECT', {
        fontSize: '16px',
        fill: '#ff0000'
    }).setOrigin(1, 0.5);

    // --- Notes Setup ---
    notesGroup = this.physics.add.group();

    // Timer to spawn notes periodically
    spawnTimer = this.time.addEvent({
        delay: 1000, // Spawn a note every 1000ms (1 second)
        callback: () => {
            if (gameState === 'playing') { // Only spawn notes if the game is active
                spawnNote(this, playfieldStartX, laneWidth, numLanes);
            }
        },
        callbackScope: this,
        loop: true
    });

    // --- Score Display ---
    scoreText = this.add.text(gameWidth - 16, 16, 'Score: 0', {
        fontSize: '24px',
        fill: '#fff',
        align: 'right'
    }).setOrigin(1, 0);

    // --- Input Setup ---
    keys = this.input.keyboard.addKeys(laneKeys.join(','));

    for (let i = 0; i < laneKeys.length; i++) {
        const key = keys[laneKeys[i]];
        key.on('down', () => {
            // Pass the necessary layout constants to the hitNote function
            hitNote(this, i, judgmentLineY, playfieldStartX, laneWidth);
        });
    }

    // --- Game End Timer ---
    // Calls the global endGame function after 30 seconds. No arguments or scope needed.
    gameEndTimer = this.time.delayedCall(30000, endGame);

    // --- ESC to End Listener ---
    this.input.keyboard.on('keydown-ESC', () => {
        if (gameState === 'playing') {
            console.log("ESC pressed, forcing game end.");
            endGame(); // Call the global endGame function
        }
    });

    // --- Restart Listener ---
    this.input.keyboard.on('keydown-ENTER', () => {
        if (gameState === 'finished') { // Only restart if the game is finished
            this.scene.restart();
        }
    });
}

// Update function: runs every frame, game loop
function update() {
    if (gameState !== 'playing') {
        return; // Skip processing when not playing
    }

    // Process notes that go past the judgment line (misses)
    // Iterate backwards because we are destroying items from the group, which is safer.
    const notes = notesGroup.getChildren();
    for (let i = notes.length - 1; i >= 0; i--) {
        const note = notes[i];
        if (note.y > judgmentLineY + judgmentWindows.MISS) {
            // Only show 'MISS' judgment and reset combo during active play
            if (gameState === 'playing') {
                console.log("Miss!");
                displayJudgment(this, 'MISS', '#888888');
                // Here you would typically reset the combo
            }
            note.destroy(); // Destroy the note regardless of game state
        }
    }
}

function endGame() {
    // Prevent multiple calls
    if (gameState !== 'playing') return;

    // Stop spawning and schedule timers
    if (spawnTimer) {
        spawnTimer.remove();
        spawnTimer = null;
    }
    if (gameEndTimer) {
        gameEndTimer.remove();
        gameEndTimer = null;
    }

    // Destroy all remaining notes immediately
    notesGroup.clear(true, true);

    // Mark game as finished
    gameState = 'finished';

    // Display "Game Clear" text
    const cx = config.width / 2;
    const cy = config.height / 2;
    game.scene.keys.default.add.text(cx, cy - 50, 'GAME CLEAR', {
        fontSize: '64px',
        fill: '#ffff00',
        align: 'center',
        stroke: '#000000',
        strokeThickness: 6
    }).setOrigin(0.5);

    // Display restart instruction
    game.scene.keys.default.add.text(cx, cy + 50, 'Press ENTER to Restart', {
        fontSize: '24px',
        fill: '#ffffff',
        align: 'center'
    }).setOrigin(0.5);
}

function displayJudgment(scene, text, color = '#ffffff') {
    const judgmentText = scene.add.text(scene.sys.game.config.width / 2, scene.sys.game.config.height / 2, text, {
        fontSize: '48px',
        fill: color,
        align: 'center',
        stroke: '#000000',
        strokeThickness: 4
    }).setOrigin(0.5);

    scene.tweens.add({
        targets: judgmentText,
        alpha: { from: 1, to: 0 },
        y: '-=50', // Move up slightly
        duration: 600,
        ease: 'Power1',
        onComplete: () => {
            judgmentText.destroy();
        }
    });
}

function spawnNote(scene, playfieldStartX, laneWidth, numLanes) {
    const lane = Phaser.Math.Between(0, numLanes - 1);
    const x = playfieldStartX + (lane * laneWidth) + (laneWidth / 2);
    const y = -50; // Start above the screen

    const note = scene.add.rectangle(x, y, laneWidth - 10, 30, 0x00ff00); // Green note
    notesGroup.add(note); // Add to the physics group

    note.body.setVelocityY(200); // Set falling speed
}

function hitNote(scene, laneIndex, judgmentLineY, playfieldStartX, laneWidth) {
    const targetX_min = playfieldStartX + (laneIndex * laneWidth);
    const targetX_max = targetX_min + laneWidth;

    let closestNote = null;
    let minDistance = Infinity;

    // Find the closest note in the correct lane
    notesGroup.getChildren().forEach(note => {
        const noteX = note.x;
        const noteY = note.y;

        // Check if the note is in the correct lane and is hittable
        if (noteX > targetX_min && noteX < targetX_max && Math.abs(noteY - judgmentLineY) < judgmentWindows.MISS) {
            const distance = Math.abs(noteY - judgmentLineY);
            if (distance < minDistance) {
                minDistance = distance;
                closestNote = note;
            }
        }
    });

    // --- Visual Feedback for the key press ---
    const feedbackRect = scene.add.rectangle(targetX_min + laneWidth / 2, judgmentLineY, laneWidth, 80, 0xffffff, 0.4);
    scene.tweens.add({
        targets: feedbackRect,
        alpha: 0,
        duration: 150,
        onComplete: () => { feedbackRect.destroy(); }
    });

    // If a hittable note was found, process the hit
    if (closestNote) {
        const distance = Math.abs(closestNote.y - judgmentLineY);
        let judgment = '';
        let scoreValue = 0;
        let color = '#ffffff';

        if (distance <= judgmentWindows.PERFECT) {
            judgment = 'PERFECT';
            scoreValue = 100;
            color = '#ffdd00'; // Gold
        } else if (distance <= judgmentWindows.GREAT) {
            judgment = 'GREAT';
            scoreValue = 50;
            color = '#00ff00'; // Green
        } else if (distance <= judgmentWindows.GOOD) {
            judgment = 'GOOD';
            scoreValue = 20;
            color = '#00bbff'; // Blue
        }

        // Destroy the note and update score/UI
        closestNote.destroy();
        score += scoreValue;
        scoreText.setText('Score: ' + score);
        console.log(`${judgment} in lane ${laneIndex + 1}!`);
        displayJudgment(scene, judgment, color);
    }
}
