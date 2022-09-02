import Phaser from 'phaser';
// import { io } from 'socket.io-client';

export default class MeditationRoom extends Phaser.Scene {
  constructor(name, { store, socket }) {
    super({ key: 'MeditationRoom' });
    //why do we have "name" in constructor and super?
    // this.store = store,
    this.socket = socket;
  }

  preload() {
    this.load.image('medRoom', 'assets/meditationroom.png');
    this.load.image('exit', 'assets/exit.png');
    this.load.image('start', 'assets/button.png');
    this.load.audio('music', 'assets/relaxing.mp3');
    this.load.spritesheet('breathingAnim', 'assets/breathe2.png', {
      frameWidth: 600,
      frameHeight: 628,
    });
  }

  create() {
    const breathAnim = this.anims.create({
      key: 'breath',
      frames: this.anims.generateFrameNumbers('breathingAnim'),
      frameRate: 12,
      repeat: -1,
    });
    const sprite = this.add.sprite(400, 300, 'breathingAnim');
    sprite.setDepth(1);

    this.add.image(400, 300, 'medRoom');

    const music = this.sound.add('music');
    music.play();

    const exitButton = this.add.image(50, 450, 'exit').setInteractive();

    const startButton = this.add
      .image(400, 300, 'start')
      .setInteractive()
      .setScale(0.5)
      .setDepth(2);

    exitButton.on(
      'pointerup',
      function () {
        music.destroy();
        this.scene.start('MainRoom');
      },
      this
    );

    startButton.on(
      'pointerup',
      function () {
        sprite.play({ key: 'breath' });
        startButton.destroy();
      },
      this
    );
  }

  update() {}
}
