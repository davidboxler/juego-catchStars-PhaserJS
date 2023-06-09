import Level1 from '../assets/scenes/Level1.js';
import GameOver from '../assets/scenes/GameOver.js';
import Level2 from '../assets/scenes/Level2.js';
import Level3 from '../assets/scenes/Level3.js';
import Win from '../assets/scenes/Winner.js';
import Preload from '../assets/scenes/Preloaded.js';

// Create a new Phaser config object
const config = {
  type: Phaser.AUTO,
  width: 960,
  height: 640,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: {
      width: 800,
      height: 600,
    },
    max: {
      width: 1600,
      height: 1200,
    },
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
      debug: false,
    },
  },
  // List of scenes to load
  // Only the first scene will be shown
  // Remember to import the scene before adding it to the list
  scene: [Preload, Level1, GameOver, Level2, Level3, Win],
};

// Create a new Phaser game instance
window.game = new Phaser.Game(config);