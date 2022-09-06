import Phaser from 'phaser';

export default class GameRoom extends Phaser.Scene {
  constructor() {
    super({ key: 'GameRoom' });

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

    this.load.image('rock', 'assets/dino/rock.png');
    this.load.image('bush', 'assets/dino/bush.png');
    this.load.image('cactus', 'assets/dino/cactus.png');
    this.load.image('disk', 'assets/dino/diskBig.png');
    this.load.image('wideRock', 'assets/dino/wideRock.png');
    this.load.image('error', 'assets/dino/serverError.png');

    this.load.audio('runningSound', 'assets/dino/footstep_concrete_003.ogg');
    this.load.audio('exitSound', 'assets/doorClose_1.ogg');
    this.load.audio('playAgainSound', 'assets/dino/jingles_HIT01.ogg');
  }

  create() {
    const div = document.getElementById('gameContainer');
    this.add.image(400, 300, 'sky');
    const { height, width } = this.game.config;

    this.runningSound = this.sound.add('runningSound', { loop: true });
    this.runningSound.play();

    this.exitSound = this.sound.add('exitSound');
    this.playAgainSound = this.sound.add('playAgainSound');

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

    this.obstacles = this.physics.add.group();

    this.physics.add.collider(
      this.player,
      this.obstacles,
      () => {
        this.runningSound.pause();
        const gameOverText = this.add.text(300, 400, 'Game Over', {
          fontSize: '64px',
          fill: '#EE3D73', //font color
        });
        const b = gameOverText.getBounds();
        gameOverText.setPosition((800 - b.width) / 2, 400);
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
        this.runningSound.destroy();
        this.exitSound.play();
        this.gameOver = false;
        this.scene.start('MainRoom');
      },
      this
    );

    restartButton.on(
      'pointerup',
      function () {
        this.runningSound.destroy();
        this.playAgainSound.play();
        this.gameOver = false;
        this.scene.restart();
      },
      this
    );

    this.score = 0;
    this.scoreText = this.add.text(500, 30, `Score: ${this.score}`, {
      fontSize: '36px',
      fill: '#BFF0D4',
    });

    this.messageIndex = 0;
  }

  updateMessage() {
    const messages = [
      'talented',
      'brilliant',
      'incredible',
      'amazing',
      'show stopping',
      'spectacular',
      'totally unique',
    ];

    if (this.messageIndex === 0) {
      console.log('first text');
      this.messageText = this.add.text(
        250,
        300,
        `You are ${messages[this.messageIndex]}`,
        {
          fontSize: '36px',
          fill: '#EE3D73',
          fontStyle: 'bold',
        }
      );
      const b = this.messageText.getBounds();
      this.messageText.setPosition((800 - b.width) / 2, 300);
    }

    if (0 < this.messageIndex < messages.length - 1) {
      this.messageText.setText(`You are ${messages[this.messageIndex]}`);
      const b = this.messageText.getBounds();
      this.messageText.setPosition((800 - b.width) / 2, 300);
    }

    if (this.messageIndex === 7) {
      this.messageText.setText('You can overcome any obstacle!');
      const b = this.messageText.getBounds();
      this.messageText.setPosition((800 - b.width) / 2, 300);
    }

    if (this.messageIndex < 7) {
      this.messageIndex++;
    }
  }

  placeObstacle() {
    const distance = Phaser.Math.Between(600, 900);
    const obstacleNum = Math.floor(Math.random() * 6);

    let obstacle;

    const obstaclesArr = [
      'rock',
      'bush',
      'cactus',
      'error',
      'wideRock',
      'disk',
    ];

    if (
      obstaclesArr[obstacleNum] === 'bush' ||
      obstaclesArr[obstacleNum] === 'wideRock' ||
      obstaclesArr[obstacleNum] === 'rock'
    ) {
      obstacle = this.obstacles.create(
        this.game.config.width + distance,
        this.game.config.height - 65,
        `${obstaclesArr[obstacleNum]}`
      );
    } else {
      obstacle = this.obstacles.create(
        this.game.config.width + distance,
        this.game.config.height - 80,
        `${obstaclesArr[obstacleNum]}`
      );
    }

    obstacle.setImmovable();
  }

  update(time, delta) {
    if (this.gameOver) {
      return;
    }
    this.score++;
    this.scoreText.setText(`Score: ${this.score}`);

    if (this.score % 300 === 0 && this.score <= 2400) {
      this.updateMessage();
    }

    this.cloudsWhite.tilePositionX += 0.25;
    this.cloudsWhiteSmall.tilePositionX += 0.5;

    // every update the ground tile will move forward by this amt
    this.ground.tilePositionX += this.gameSpeed;

    Phaser.Actions.IncX(this.obstacles.getChildren(), -this.gameSpeed);
    // Takes an array of Game Objects, or any objects that have a public x property, and then adds the given value to each of their x properties.

    this.respawnTime += delta * this.gameSpeed * 0.08;
    this.gameSpeed += 0.003;

    if (this.respawnTime >= 1500) {
      this.placeObstacle();
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
      this.runningSound.pause();
    } else {
      this.player.play('run', true);
      this.runningSound.resume();
    }
  }
}
