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
    // speed the ground moves in px/second
    this.gameSpeed = 10;
    const { height, width } = this.game.config;

    this.ground = this.add
      .tileSprite(0, height, width, 26, 'ground')
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
    // this.anims.create({
    //   key: 'jump',
    // });

    this.player = this.physics.add
      .sprite(0, 500, 'dino')
      .setOrigin(0, 1)
      .setCollideWorldBounds(true)
      .setGravityY(10);
    this.player.play('run');
    this.handleInputs();

    this.physics.add.collider(this.player, this.ground);
  }

  /* this.input.pointer //(property) globalThis.Phaser.Input.InputPlugin.pointer1: Phaser.Input.Pointer
    A touch-based Pointer object. This will be undefined by default unless you add a new Pointer using addPointer. */
  handleInputs() {
    this.input.keyboard.on('keydown_SPACE', () => {
      this.player.setVelocityY(-1600);
    });
  }

  // 60fps
  update() {
    // every update the ground tile will move forward by this amt
    this.ground.tilePositionX += this.gameSpeed;
  }
}
