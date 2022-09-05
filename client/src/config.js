/** @type {import('./typings/phaser')} */
import 'phaser';
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  render: {
    pixelArt: true,
  },
  scale: {
    parent: 'app',
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
    createContainer: true,
  },
  scene: [],
};
export default config;
