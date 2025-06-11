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
function create() {
    // Example: this.add.image(400, 300, 'sky');
    // We will add game objects and logic here later
    console.log("Game created!");
    this.add.text(config.width / 2, config.height / 2, 'SynthStellar Beat Game\nReady!', {
        fontSize: '32px',
        fill: '#fff',
        align: 'center'
    }).setOrigin(0.5);
}

// Update function: runs every frame, game loop
function update() {
    // Game logic that needs to run continuously
    // Example: player.x += 1;
}
