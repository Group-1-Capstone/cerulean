import Phaser from 'phaser';

const config = {
  type: Phaser.AUTO,
  width: 1334,
  height: 750,
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
