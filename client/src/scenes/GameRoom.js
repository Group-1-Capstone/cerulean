import Phaser from 'phaser';

export default class GameRoom extends Phaser.Scene {
  constructor({ socket }) {
    super({ key: 'GameRoom' });
    this.socket = socket;
    this.cloudsWhite;
    this.cloudsWhiteSmall;
    this.gameOver = false;
  }

  preload() {
    this.load.image('ground', 'assets/dino/ground.png');
    this.load.image('sky', 'assets/dino/sky.png');
    this.load.image('restart', 'assets/dino/restart.png');
    this.load.image('game-over', 'assets/dino/game-over.png');
    this.load.image('clouds-white', 'assets/clouds-white.png');
    this.load.image('clouds-white-small', 'assets/clouds-white-small.png');
    this.load.atlas(
      'characterAtlas',
      'assets/dino/spritesheetalec.png',
      'assets/dino/spritesheetalec.json'
    );
    this.load.image('exitButton', 'assets/button.png');
    this.load.image('restartButton', 'assets/bomb.png');
    // this.load.image('rock', 'assets/dino/disk-1.png' )
    this.load.image('rock', 'assets/dino/rock.png');
  }

  create() {
    const div = document.getElementById('gameContainer');
    this.add.image(400, 300, 'sky');
    const { height, width } = this.game.config;

    this.gameSpeed = 10;
    this.ground = this.add
      .tileSprite(0, height, width, 32, 'ground')
      .setOrigin(0, 1);

    this.respawnTime = 0;

    this.cloudsWhite = this.add.tileSprite(400, 260, 800, 420, 'clouds-white');
    this.cloudsWhiteSmall = this.add.tileSprite(
      400,
      260,
      800,
      415,
      'clouds-white-small'
    );

    this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNames('characterAtlas', {
        prefix: 'alec',
        end: 8,
        zeroPad: 1,
      }),
      repeat: -1,
    });

    this.player = this.physics.add
      .sprite(0, height, 'characterAtlas')
      .setOrigin(0, 1)
      .setCollideWorldBounds(true)
      .setGravityY(5000)
      .play('run');

    this.obsticles = this.physics.add.group();

    this.physics.add.collider(
      this.player,
      this.obsticles,
      () => {
        const gameOverText = this.add.text(400, 300, 'The End', {
          fontSize: '64px',
          fill: '#EE3D73', //font color
        });
        this.gameOver = true;
        this.player.anims.stop();
      },
      null,
      this
    );

    const exitButton = this.add
      .image(50, 50, 'exitButton')
      .setInteractive()
      .setScale(0.2)
      .setDepth(1);

    const restartButton = this.add
      .image(120, 50, 'restartButton')
      .setInteractive()
      .setScale(3)
      .setDepth(1);

    exitButton.on(
      'pointerup',
      function () {
        this.gameOver = false;
        this.scene.start('MainRoom');
      },
      this
    );

    restartButton.on(
      'pointerup',
      function () {
        this.gameOver = false;
        this.scene.restart();
      },
      this
    );
    this.score = 0;
    this.scoreText = this.add.text(500, 400, `Score: ${this.score}`, {
      fontSize: '24px',
      fill: '#BFF0D4',
    });
  }

  placeObsticle() {
    const distance = Phaser.Math.Between(600, 900);

    let obsticle;

    obsticle = this.obsticles
      .create(
        this.game.config.width + distance,
        this.game.config.height,
        'rock'
      )
      .setScale(0.5)
      .setOrigin(0, 1);

    obsticle.body.offset.y = +10;

    obsticle.setImmovable();
  }

  update(time, delta) {
    if (this.gameOver) {
      return;
    }
    this.score++;
    this.scoreText.setText(`Score: ${this.score}`);

      this.cloudsWhite.tilePositionX += 0.25;
      this.cloudsWhiteSmall.tilePositionX += 0.5;

      // every update the ground tile will move forward by this amt
      this.ground.tilePositionX += this.gameSpeed;

      Phaser.Actions.IncX(this.obsticles.getChildren(), -this.gameSpeed);
      // Takes an array of Game Objects, or any objects that have a public x property, and then adds the given value to each of their x properties.

      this.respawnTime += delta * this.gameSpeed * 0.08;
      // this.gameSpeed += 0.01

      if (this.respawnTime >= 1500) {
        this.placeObsticle();
        this.respawnTime = 0;
      }

      if (this.input.activePointer.isDown) {
        if (!this.player.body.onFloor()) {
          return;
        }
        this.player.setVelocityY(-1600);
      }

      if (this.player.body.deltaAbsY() > 0) {
        //while in air
        this.player.anims.stop();
        this.player.setFrame('alec8');
      } else {
        this.player.play('run', true);
      }
    }
  }
}
