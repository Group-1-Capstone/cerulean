import Phaser from 'phaser';

export default class SinglePlayerGame extends Phaser.Scene {
  constructor({ socket }) {
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
    // canvas height and width
    const { height, width } = this.game.config;
    /* var image = scene.add.tileSprite(x, y, width, height, textureKey); */
    // speed the ground moves in px/second
    this.gameSpeed = 10;
    console.log('this', this);
    this.ground = this.add
      .tileSprite(0, height, width, 26, 'ground')
      .setOrigin(0, 1);

    console.log('this.ground', this.ground);

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

    this.player = this.physics.add
      .sprite(0, height, 'characterAtlas')
      .setOrigin(0, 1)
      .setCollideWorldBounds(true)
      .setGravityY(5000)
      .play('run');
      
    

    this.physics.add.collider(this.player, this.ground);
    
    console.log("player", this.player)
    console.log("touching", this.player.body.touching.down)
    console.log("onFloor", this.player.body.onFloor())
  }

  /* this.input.pointer //(property) globalThis.Phaser.Input.InputPlugin.pointer1: Phaser.Input.Pointer
    A touch-based Pointer object. This will be undefined by default unless you add a new Pointer using addPointer. */
  handleInputs() {
    this.input.keyboard.on('keydown_SPACE', () => {
      if (!this.player.body.onFloor() || this.player.body.velocity.x > 0) {
        return;
      }
      this.player.setVelocityY(-1600);
    });
  }

  // 60fps
  update() {
    // every update the ground tile will move forward by this amt
    this.ground.tilePositionX += this.gameSpeed;
    
    const cursors = this.input.keyboard.createCursorKeys();
    if (cursors.up.isDown && this.player.body.touching.down) {
      console.log("test")
      this.player.setVelocityY(-1600); //-420 //jump height
    }
    
  }
  
}
