import Phaser, { Core } from 'phaser';
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
// ???  const initGame = new Phaser.Game(config);
export default config;
