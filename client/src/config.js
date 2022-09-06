/** @type {import('./typings/phaser')} */
import 'phaser';
const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  render: {
    pixelArt: true,
  },
  scale: {
    parent: 'gameContainer',
    // scaleMode: Phaser.Scale.FIT,
    autoCenter: true,
  },
  transparent: true,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
      gravity: { y: 0 },
      enableBody: true,
    },
  },
  dom: {
    createContainer: false,
  },
  scene: [],
};
export default config;
