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
      'characterAtlas',
      'assets/dino/spritesheetalec.png',
      'assets/dino/spritesheetalec.json'
    );
  }

  create() {
    this.ground = this.add
      .tileSprite(0, 600, 800, 26, 'ground')
      .setOrigin(0, 1);
    this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNames('characterAtlas', {
        prefix: 'alec',
        end: 8,
        zeroPad: 1,
      }),
      repeat: -1,
    });
    const character = this.add
      .sprite(0, 625, 'dino')
      .setOrigin(0, 1)
      .play('run');
  }
}
