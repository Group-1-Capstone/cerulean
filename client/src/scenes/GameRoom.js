import Phaser from 'phaser';

export default class GameRoom extends Phaser.Scene {
  constructor({ socket }) {
    super({ key: 'GameRoom' });
    this.socket = socket;
    this.cloudsWhite;
    this.cloudsWhiteSmall;
  }

  preload() {
    this.load.image('ground', 'assets/dino/ground.png');
    this.load.image('restart', 'assets/dino/restart.png');
    this.load.image('game-over', 'assets/dino/game-over.png');
    this.load.image('clouds-white', 'assets/clouds-white.png');
    this.load.image('clouds-white-small', 'assets/clouds-white-small.png');
    this.load.atlas(
      'characterAtlas',
      'assets/dino/spritesheetalec.png',
      'assets/dino/spritesheetalec.json'
    );
    this.load.image('rock', 'assets/dino/rock.png' )
  }

  create() {
    const div = document.getElementById('gameContainer');
    div.style.backgroundColor = '#5DACD8';
    // canvas height and width
    const { height, width } = this.game.config;
    /* var image = scene.add.tileSprite(x, y, width, height, textureKey); */
    // speed the ground moves in px/second
    this.gameSpeed = 10;
    // console.log('this', this);
    this.ground = this.add
      .tileSprite(0, height, width, 26, 'ground')
      .setOrigin(0, 1);

    this.respawnTime = 0;

    // console.log('this.ground', this.ground);

    this.cloudsWhite = this.add.tileSprite(400, 260, 800, 420, 'clouds-white');
    this.cloudsWhiteSmall = this.add.tileSprite(400, 260, 800, 415, 'clouds-white-small');

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
    //   frames:
    // });
    
    
    // let gameTime = 0
    // this.scoreText = this.add.text(width, 0, "00000", {fill: "#535353", font: '900 35px Courier', resolution: 5})
    //   .setOrigin(1, 0)
    //   .setAlpha(0);

    this.player = this.physics.add
      .sprite(0, height, 'characterAtlas')
      .setOrigin(0, 1)
      .setCollideWorldBounds(true)
      .setGravityY(5000)
      .play('run');
      
    // const rock = this.physics.add.image(600, height, 'rock').setOrigin(0, 1)
      
    // this.player.addListener('click', () => {
    //   this.player.setFrame('alec8');
    // });



    // this.physics.add.collider(this.player, this.ground);
    //this isn't doing anything since this.ground wasn't added with physics
    //and if you physics.add the ground it breaks. 
    
    this.obsticles = this.physics.add.group();
    
    this.physics.add.collider(this.player, this.obsticles, () => {
      // this.highScoreText.x = this.scoreText.x - this.scoreText.width - 20;

      // const highScore = this.highScoreText.text.substr(this.highScoreText.text.length - 5);
      // const newScore = Number(this.scoreText.text) > Number(highScore) ? this.scoreText.text : highScore;

      // this.highScoreText.setText('HI ' + newScore);
      // this.highScoreText.setAlpha(1);

      this.physics.pause();
      // this.isGameRunning = false;
      // this.anims.pauseAll();
      // this.respawnTime = 0;
      // this.gameSpeed = 10;
      // this.gameOverScreen.setAlpha(1);
      // this.score = 0;
      // this.hitSound.play();
    }, null, this);
    
    
    // console.log("player", this.player)
    // console.log("body", this.player.body)
    // console.log("blocked down", this.player.body.blocked.down)
    // console.log("touching", this.player.body.touching.down)
    // console.log("onFloor", this.player.body.onFloor())
    
    
    // this works console.log("width", this.game.config.width)
    // const rock = this.physics.add.image(this.game.config.width, this.game.config.height, 'rock')
    //   .setOrigin(0, 1);

    // rock.body.offset.y = +10;
    
    // this.handleInputs()
  }

  /* this.input.pointer //(property) globalThis.Phaser.Input.InputPlugin.pointer1: Phaser.Input.Pointer
    A touch-based Pointer object. This will be undefined by default unless you add a new Pointer using addPointer. */
 
  // handleInputs() {
  //   console.log("inputs invoked")
  // }

  placeObsticle() {
    // change obsticleNum to match our num of obstacles
    // e.g. Math.floor(Math.random() * 7) is 0 through 6.  
    // const obsticleNum = Math.floor(Math.random() * 7) + 1;
    
    //do an array and create obstacle[random index] instead of tutorial naming system
    
    const distance = Phaser.Math.Between(this.game.config.width - 200);

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
        
    obsticle = this.obsticles.create(this.game.config.width + distance, this.game.config.height, 'rock')
        .setOrigin(0, 1);

     obsticle.body.offset.y = +10;

    obsticle.setImmovable();
  }

  // 60fps
  update(delta) {
    
    this.cloudsWhite.tilePositionX += 0.5;
    this.cloudsWhiteSmall.tilePositionX += 0.25;
    // every update the ground tile will move forward by this amt
    this.ground.tilePositionX += this.gameSpeed;
    Phaser.Actions.IncX(this.obsticles.getChildren(), -this.gameSpeed);
    // Takes an array of Game Objects, or any objects that have a public x property, and then adds the given value to each of their x properties.
    
    this.respawnTime += delta * this.gameSpeed * 0.08;
    if (this.respawnTime >= 1500) {
      this.placeObsticle();
      this.respawnTime = 0;
    }
    
    if(this.input.activePointer.isDown) {
      if (!this.player.body.onFloor()) {
        // console.log("onfloor in air", this.player.body.onFloor())
        return; }
        //works the same without checking x velocity > 0 
      // if (!this.player.body.onFloor() || this.player.body.velocity.x > 0) { return; }
      
      // console.log("onfloor, jump", this.player.body.onFloor())
      // this.player.setFrame('alec8'); //makes him stop on the frame while mouse is held
      this.player.setVelocityY(-1600);
       
      //TODO: set him to 1 frame in air 
      // this.player.texture.frames['alec8']; //doesnt work
      
    
      
    }
      if (this.player.body.deltaAbsY() > 0) {
        //while in air
        this.player.anims.stop();
        this.player.setFrame('alec8');
      } else {
        this.player.play('run', true)
      }
    
    
    // const cursors = this.input.keyboard.createCursorKeys();
    // if (cursors.up.isDown && this.player.body.touching.down) {
    //   console.log("test")
    //   this.player.setVelocityY(-1600); //-420 //jump height
    // }
    
  }
  
}
