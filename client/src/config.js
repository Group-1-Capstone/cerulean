import Phaser from 'phaser';

const config = {
  type: Phaser.AUTO,
  width: 1334,
  height: 600,
  pixelArt: true,
  transparent: true,
  parent: 'gameContainer',
  physics: {
    default: 'arcade',
    arcade: {
      enableBody: true,
    },
  },
  dom: {
    createContainer: true,
  },
};

export default config;
