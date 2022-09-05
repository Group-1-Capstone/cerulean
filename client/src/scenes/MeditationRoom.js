import Phaser from 'phaser';

export default class MeditationRoom extends Phaser.Scene {
  constructor() {
    super('MeditationRoom');
  }

  preload() {
    this.load.image('medRoom', 'assets/meditationroom.png');
    this.load.image('exit', 'assets/back-button.png');
    this.load.image('start', 'assets/play-button.png');
    this.load.audio('music', 'assets/relaxing.mp3');
    this.load.spritesheet('breathingAnim', 'assets/breathe-sprite3.png', {
      frameWidth: 600,
      frameHeight: 600,
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

    const exitButton = this.add
      .image(70, 500, 'exit')
      .setInteractive()
      .setScale(0.5);

    const startButton = this.add
      .image(400, 395, 'start')
      .setInteractive()
      .setScale(0.7)
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
