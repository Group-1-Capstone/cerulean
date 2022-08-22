import Phaser from 'phaser';
import Main from './Main';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 20 },
    },
  },
  scene: Main,
};

export default config;
