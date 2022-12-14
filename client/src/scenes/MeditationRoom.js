import Phaser from 'phaser';

export default class MeditationRoom extends Phaser.Scene {
  constructor() {
    super({ key: 'MeditationRoom' });
  }

  init(data) {
    this.avatar = data.avatar;
  }

  preload() {
    this.load.image('medRoom', 'assets/medroom.png');
    this.load.image('EXIT', 'assets/exitbutton.png');
    this.load.image('start', 'assets/play-button.png');
    this.load.audio('music', 'assets/relaxing.mp3');
    this.load.spritesheet('breathingAnim', 'assets/breathe-sprite3.png', {
      frameWidth: 600,
      frameHeight: 600,
    });

    this.load.audio('exitSound', 'assets/doorClose_1.ogg');
  }

  create() {
    const breathAnim = this.anims.create({
      key: 'breath',
      frames: this.anims.generateFrameNumbers('breathingAnim'),
      frameRate: 12,
      repeat: -1,
    });
    const sprite = this.add.sprite(650, 300, 'breathingAnim');
    sprite.setDepth(1);

    this.add.image(650, 300, 'medRoom');

    this.exitSound = this.sound.add('exitSound', { volume: 0.25 });

    const music = this.sound.add('music');
    music.play();

    const exitButton = this.add
      .image(1250, 70, 'EXIT')
      .setInteractive()
      .setScale(0.7);

    const startButton = this.add
      .image(650, 395, 'start')
      .setInteractive()
      .setScale(0.1)
      .setDepth(2);

    exitButton.on(
      'pointerup',
      function () {
        music.destroy();
        this.exitSound.play();
        this.scene.start('MainRoom', { avatar: this.avatar });
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
}
