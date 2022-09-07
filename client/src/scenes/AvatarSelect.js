import Phaser from 'phaser';

export default class AvatarSelect extends Phaser.Scene {
  constructor() {
    super({ key: 'AvatarSelect' });
  }

  preload() {
    this.load.image('bg', 'assets/blank.png');

    this.load.image('avatar1', 'assets/avatar1.png');
    this.load.image('avatar2', 'assets/avatar2.png');
    this.load.image('avatar3', 'assets/avatar3.png');
    this.load.image('avatar4', 'assets/avatar4.png');
  }

  create() {
    const bg = this.add.image(650, 300, 'bg');

    const promptText = this.add.text(700, 100, 'Please select your avatar', {
      fontSize: '32px',
      fill: '#EE3D73',
      fontStyle: 'bold',
    });
    const b = promptText.getBounds();
    promptText.setPosition((1300 - b.width) / 2, 100);

    const avatar1 = this.add.image(250, 300, 'avatar1').setInteractive();
    const avatar2 = this.add.image(500, 300, 'avatar2').setInteractive();
    const avatar3 = this.add.image(750, 300, 'avatar3').setInteractive();
    const avatar4 = this.add.image(1000, 300, 'avatar4').setInteractive();

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

    avatar3.on(
      'pointerup',
      function () {
        this.scene.start('MainRoom', { avatar: 'avatar3' });
      },
      this
    );

    avatar4.on(
      'pointerup',
      function () {
        this.scene.start('MainRoom', { avatar: 'avatar4' });
      },
      this
    );
  }

  update() {}
}
