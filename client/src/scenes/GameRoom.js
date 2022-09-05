import Phaser from 'phaser';

export default class GameRoom extends Phaser.Scene {
  constructor({}) {
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
    // this.load.image('rock', 'assets/dino/rock.png');
    this.load.image('rock', 'assets/dino/rockTrans.png');
    this.load.image('bush', 'assets/dino/bush.png');
    this.load.image('cactus', 'assets/dino/cactus2.png');
    this.load.image('disk', 'assets/dino/diskBig.png');
    this.load.image('wideRock', 'assets/dino/wideRock.png');
    this.load.image('duck', 'assets/dino/kaczuha 1.png');
    this.load.image('pizza', 'assets/dino/pizzaslice.png');
    this.load.image('error', 'assets/dino/serverError2.png');
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
        const gameOverText = this.add.text(300, 400, 'The End', {
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
    this.scoreText = this.add.text(575, 30, `Score: ${this.score}`, {
      fontSize: '24px',
      fill: '#BFF0D4',
    });

    this.messageIndex = 0;
  }

  updateMessage() {
    // let messageIndex = 0; //this is resetting the index every time...want this as a global variable closure?
    const messages = [
      'talented',
      'brilliant',
      'incredible',
      'amazing',
      'show stopping',
      'spectacular',
      'totally unique',
    ];
    //unstoppable, you can do anything, you can overcome any obstacle

    // console.log('update invoked');

    if (this.messageIndex === 0) {
      console.log('first text');
      this.messageText = this.add.text(
        250,
        300,
        `You are ${messages[this.messageIndex]}`,
        {
          fontSize: '36px', //make sure longer words fit on screen
          fill: '#EE3D73',
        }
      );
    }
    if (0 < this.messageIndex < messages.length - 1) {
      // console.log('change message');
      // console.log('msgtext', messages[this.messageIndex]);
      this.messageText.setText(`You are ${messages[this.messageIndex]}`);
    }
    if (this.messageIndex < 6) {
      // console.log('msgindx', this.messageIndex);
      //only have 6 words so don't want the message to be an undefined index
      this.messageIndex++;
    }
  }

  placeObsticle() {
    const distance = Phaser.Math.Between(600, 900);
    const obstacleNum = Math.floor(Math.random() * 6);
    console.log('obsNum', obstacleNum);

    let obsticle;

    const obstaclesArr = [
      'rock',
      'bush',
      'cactus',
      'error',
      'wideRock',
      'disk',
    ]; //index 0 to 5

    //missing duck, pizza

    console.log('creating a ', obstaclesArr[obstacleNum]);

    if (
      obstaclesArr[obstacleNum] === 'bush' ||
      obstaclesArr[obstacleNum] === 'wideRock' ||
      obstaclesArr[obstacleNum] === 'rock'
    ) {
      obsticle = this.obsticles.create(
        this.game.config.width + distance,
        this.game.config.height - 65, //- 80
        `${obstaclesArr[obstacleNum]}` //obstaclesArr[RNG from 0 to length]
      );
    } else {
      obsticle = this.obsticles.create(
        this.game.config.width + distance,
        this.game.config.height - 80, //- 80
        `${obstaclesArr[obstacleNum]}` //obstaclesArr[RNG from 0 to length]
      );
    }

    // .setScale(0.5)
    // .setOrigin(0, 1);

    // obsticle.body.offset.y = +10; //+10 shifts the hitbox? do we want this at all?

    obsticle.setImmovable();
  }

  update(time, delta) {
    if (this.gameOver) {
      return;
    }
    this.score++;
    this.scoreText.setText(`Score: ${this.score}`);

    if (this.score % 300 === 0) {
      //stop invoking it when we run out of messages to display
      //if score % 100 === 0 && score < num that gives the last message -> updateMsg
      this.updateMessage();
    }

    this.cloudsWhite.tilePositionX += 0.25;
    this.cloudsWhiteSmall.tilePositionX += 0.5;

    // every update the ground tile will move forward by this amt
    this.ground.tilePositionX += this.gameSpeed;

    Phaser.Actions.IncX(this.obsticles.getChildren(), -this.gameSpeed);
    // Takes an array of Game Objects, or any objects that have a public x property, and then adds the given value to each of their x properties.

    this.respawnTime += delta * this.gameSpeed * 0.08;
    // this.gameSpeed += 0.01;
    this.gameSpeed += 0.003;

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
