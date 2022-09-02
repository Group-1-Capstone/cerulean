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
    // canvas height and width
    const { height, width } = this.game.config;
    /* var image = scene.add.tileSprite(x, y, width, height, textureKey); */
    // speed the ground moves in px/second
    this.gameSpeed = 10;
    this.ground = this.add
      .tileSprite(0, height, width, 32, 'ground') //26
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

    // this.physics.add.collider(this.player, this.ground);
    //this isn't doing anything since this.ground wasn't added with physics
    //and if you physics.add the ground it breaks.

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
        //TODO: make everything stop, not just alec
        //he only stops if he's in the air, he keeps walking after colliding
        //this.physics.pause();

        // this.player.anims.stop();
        // this.cloudsWhite.anims.stop();
        // this.cloudsWhiteSmall.anims.stop();

        // this.isGameRunning = false;
        // this.anims.pauseAll();
        // this.respawnTime = 0;
        // this.gameSpeed = 10;
        // this.gameOverScreen.setAlpha(1);
        // this.score = 0;
        // this.hitSound.play();
      },
      null,
      this
    );

    this.score = 0;

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
    //end of create func
  }

  placeObsticle() {
    // change obsticleNum to match our num of obstacles
    // e.g. Math.floor(Math.random() * 7) is 0 through 6.
    // const obsticleNum = Math.floor(Math.random() * 7) + 1;

    //do an array and create obstacle[random index] instead of tutorial naming system

    const distance = Phaser.Math.Between(600, 900);
    //his screen is wider, maybe use this.game.config.width

    let obsticle;
    // if (obsticleNum > 6) {
    //   const enemyHeight = [20, 50];
    //   obsticle = this.obsticles.create(this.game.config.width + distance, this.game.config.height - enemyHeight[Math.floor(Math.random() * 2)], `enemy-bird`)
    //     .setOrigin(0, 1)
    //     obsticle.play('enemy-dino-fly', 1);
    //   obsticle.body.height = obsticle.body.height / 1.5;
    // } else {
    //   obsticle = this.obsticles.create(this.game.config.width + distance, this.game.config.height, `obsticle-${obsticleNum}`)
    //     .setOrigin(0, 1);

    // obsticle.body.offset.y = +10;
    // }

    // obsticle = this.obsticles.create(600, 600, 'rock')
    //     .setOrigin(0, 1);

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

  // 60fps
  update(time, delta) {
    //see if we need time param - yes, but why?
    //delta is the time from the last frame
    if (this.gameOver !== true) {
      this.cloudsWhite.tilePositionX += 0.25;
      this.cloudsWhiteSmall.tilePositionX += 0.5;

      // every update the ground tile will move forward by this amt
      this.ground.tilePositionX += this.gameSpeed;
      console.log('tileX', this.ground.tilePositionX);

      Phaser.Actions.IncX(this.obsticles.getChildren(), -this.gameSpeed);
      // Takes an array of Game Objects, or any objects that have a public x property, and then adds the given value to each of their x properties.

      this.respawnTime += delta * this.gameSpeed * 0.08;
      // this.gameSpeed += 0.01

      if (this.respawnTime >= 1500) {
        //1500 ms
        this.placeObsticle();
        this.respawnTime = 0;
      }

      if (this.input.activePointer.isDown) {
        if (!this.player.body.onFloor()) {
          return;
        }
        this.player.setVelocityY(-1600); //-1600
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
