import Phaser from 'phaser';

export default class AvatarSelect extends Phaser.Scene {
  constructor() {
    super({ key: 'AvatarSelect' });
  }

  preload() {
    this.load.image('sky', 'assets/sky.png');

    this.load.image('rock', 'assets/dino/rock.png');
    this.load.image('bush', 'assets/dino/bush.png');
    this.load.image('cactus', 'assets/dino/cactus.png');
    this.load.image('disk', 'assets/dino/diskBig.png');
  }

  create() {
    const sky = this.add.image(400, 300, 'sky');

    const promptText = this.add.text(400, 100, 'Please select your avatar', {
      fontSize: '32px',
      fill: '#EE3D73',
      fontStyle: 'bold',
    });
    const b = promptText.getBounds();
    promptText.setPosition((800 - b.width) / 2, 100);

    const avatar1 = this.add.image(300, 300, 'rock').setInteractive();

    const avatar2 = this.add.image(600, 300, 'bush').setInteractive();

    avatar1.on(
      'pointerup',
      function () {
        this.scene.start('MainRoom', { avatar: 'avatar1' });
      },
      this
    );

    avatar2.on(
      'pointerup',
      function () {
        this.scene.start('MainRoom', { avatar: 'avatar2' });
      },
      this
    );
  }

  update() {}
}
