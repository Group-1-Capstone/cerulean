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
  physics: {
    default: 'arcade',
    arcade: {
      // debug: true,
      // gravity: { y: 20 },
      enableBody: true,
    },
  },
};

export default config;
