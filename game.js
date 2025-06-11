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

function create() {
    console.log("Game created!");

    // --- Game Layout Constants ---
    const gameWidth = this.sys.game.config.width;
    const gameHeight = this.sys.game.config.height;
    const numLanes = 4;
    const laneWidth = 100;
    const playfieldWidth = numLanes * laneWidth;
    const playfieldStartX = (gameWidth - playfieldWidth) / 2;
    const judgmentLineY = gameHeight - 100;

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
        callback: () => spawnNote(this, playfieldStartX, laneWidth, numLanes),
        callbackScope: this,
        loop: true
    });
}

// Update function: runs every frame, game loop
function update() {
    // Remove notes that have gone off-screen
    notesGroup.getChildren().forEach(note => {
        if (note.y > this.sys.game.config.height + 50) {
            note.destroy();
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
