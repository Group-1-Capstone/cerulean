import Phaser from 'phaser';

class Main extends Phaser.Scene {
  constructor() {
    super('main');
  }

  preload() {
    // this.load.image('red_ball', 'sprites/red_ball.png');
    // this.load.image('red_particle', 'sprites/red.png');
    // jessie--------------------------------------------------------
    this.load.spritesheet('jessie', 'sprites/jessie.png', {
      frameWidth: 47,
      frameHeight: 63,
    });
  }

  create() {
    // this.scene.start('main');
    // create jessie--------------------------------------------------------
    this.player = this.physics.add.sprite(100, 300, 'jessie');
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    // jessie animations

    this.anims.create({
      key: 'turn',
      frames: [{ key: 'jessie', frame: 7 }],
      frameRate: 20,
    });
    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('jessie', { start: 3, end: 5 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('jessie', { start: 9, end: 11 }),
      frameRate: 10,
      repeat: -1,
    });
    console.log('animations', this.anims);
    console.log('this.player', this.player);

    //   const particles = this.add.particles('red_particle');

    //   const emitter = particles.createEmitter({
    //     speed: 200,
    //     scale: { start: 1, end: 0 },
    //     // blendMode: 'ADD'
    //   });

    //   const ball = this.physics.add.image(400, 100, 'red_ball');

    //   ball.setVelocity(100, 200);
    //   ball.setBounce(1, 1);
    //   ball.setCollideWorldBounds(true);
    //   emitter.startFollow(ball);
    // return player;
  }

  // update () {

  //     console.log('cursors', cursors);
  //     console.log('player', this.player);
  //     if (cursors.left.isDown) {
  //       this.player.setVelocityX(-160);
  //       this.player.anims.play('left', true);
  //     } else if (cursors.right.isDown) {
  //       this.player.setVelocityX(160);
  //       this.player.anims.play('right', true);
  //     } else {
  //       this.player.setVelocityX(0);
  //       this.player.anims.play('turn');
  //     }
  //     if (cursors.up.isDown && this.player.body.touching.down) {
  //       this.player.setVelocityY(-330);
  //     }
  //     // this.scene.update('main');
  // }
}
export default Main;
