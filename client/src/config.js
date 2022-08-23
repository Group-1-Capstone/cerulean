import Phaser from 'phaser';
import Main from './scenes/Main';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: Main,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
      gravity: { y: 20 },
      enableBody: true,
    },
  },
};

export default config;
