import Phaser from 'phaser';
export default class Main extends Phaser.Scene {
  constructor() {
    super('main');
  }

  preload() {
    this.load.image('red_ball', 'sprites/red_ball.png');
    this.load.image('red_particle', 'sprites/red.png');
    
    //jessie
    
    // this.load.spritesheet("jessie", jessie, {
    //   frameWidth: 47,
    //   frameHeight: 63,
    // });
  }

  create() { 

    //jessie animations

    // this.anims.create({
    //   key: "turn",
    //   frames: [{ key: "jessie", frame: 7 }],
    //   frameRate: 20,
    // });
    // this.anims.create({
    //   key: "right",
    //   frames: this.anims.generateFrameNumbers("jessie", { start: 3, end: 5 }),
    //   frameRate: 10,
    //   repeat: -1,
    // });
    // this.anims.create({
    //   key: "left",
    //   frames: this.anims.generateFrameNumbers("jessie", { start: 9, end: 11 }),
    //   frameRate: 10,
    //   repeat: -1,
    // });
    
    const particles = this.add.particles('red_particle');

    const emitter = particles.createEmitter({
      speed: 200,
      scale: { start: 1, end: 0 },
      // blendMode: 'ADD'
    });

    const ball = this.physics.add.image(400, 100, 'red_ball');

    ball.setVelocity(100, 200);
    ball.setBounce(1, 1);
    ball.setCollideWorldBounds(true);
    emitter.startFollow(ball);
  }
}