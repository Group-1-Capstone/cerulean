import Phaser from 'phaser';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  pixelArt: true,
  transparent: true,
  parent: 'gameContainer',
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
      enableBody: true,
    },
  },
  dom: {
    createContainer: true,
  },
};

export default config;
