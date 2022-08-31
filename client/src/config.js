import Phaser from 'phaser';

// const socket = io.connect();

// const main = new Main('main', { store: 'store', socket });

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  // scene: [main],
  pixelArt: true,
  transparent: true,
  parent: 'gameContainer',
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      // gravity: { y: 20 },
      enableBody: true,
    },
  },
  dom: {
    createContainer: true
},
};

export default config;
