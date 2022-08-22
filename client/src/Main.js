import Phaser from 'phaser';
import config from './config';

export default class Main extends Phaser.Scene {
  constructor() {
    super();
  }

  preload() {}

  create() {}

  update() {}
}

export const game = new Phaser.Game(config);
