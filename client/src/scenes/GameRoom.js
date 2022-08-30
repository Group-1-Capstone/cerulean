import Phaser from 'phaser';

export default class SinglePlayerGame extends Phaser.Scene {
  constructor(name, { socket }) {
    super({ key: 'GameRoom' });
    this.socket = socket;
    this.player = {};
  }

  preload() {
    this.load.image('ground', 'assets/dino/ground.png');
    this.load.image('restart', 'assets/dino/restart.png');
    this.load.image('game-over', 'assets/dino/game-over.png');
    this.load.atlas(
      'alec',
      'assets/dino/spritesheetalec.png',
      'assets/dino/spritesheetalec.json'
    );
  }

  create() {
    this.ground = this.add
      .tileSprite(0, 600, 800, 26, 'ground')
      .setOrigin(0, 1);
  }
}
