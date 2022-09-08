import Phaser from "phaser";

export default class HomeRoom extends Phaser.Scene {
  constructor() {
    super({ key: 'HomeRoom' });
  }

  preload() {
    this.load.image('background', 'assets/blank.png');
    this.load.image('logo', 'assets/logotransparent.png');
    this.load.image('enter', 'assets/enter-button.png');
    this.load.image('about', 'assets/about-button.png');
    this.load.image('musicOn', 'assets/music_on_blk.png');
    this.load.image('musicOff', 'assets/music_off_blk.png');
    this.load.audio('themeMusic', 'assets/theme.mp3');
  }

  create() {
    // these put x and y at screen center:
    const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

    const background = this.add.image(screenCenterX, screenCenterY, 'background').setDepth(-1);
    const logo = this.add.image(screenCenterX, screenCenterY / 1.3, 'logo').setDepth(1);
    
    const enterButton = this.add.image(575, screenCenterY * 1.35, 'enter').setInteractive().setDepth(1);
    const aboutButton = this.add.image(775, screenCenterY * 1.35, 'about').setInteractive().setDepth(1);
    
    this.themeMusic = this.sound.add('themeMusic', {
      volume: 0.25,
      loop: true,
    });
    
    this.musicOnButton = this.add.image(50, 50, 'musicOn').setScale(.5).setInteractive();
    this.musicOnButton.visible = true;

    this.musicOffButton = this.add.image(50, 50, 'musicOff').setScale(.5).setInteractive();
    this.musicOffButton.visible = false;

    this.musicOnButton.on(
      'pointerup', 
      () => {
        this.themeMusic.play();
        this.musicOffButton.visible = true;
        this.musicOnButton.visible = false;
      },
      this
    );

    this.musicOffButton.on(
      'pointerup', 
      () => {
        this.themeMusic.stop();
        this.musicOnButton.visible = true;
        this.musicOffButton.visible = false;
      },
      this
    );

    enterButton.on(
      'pointerup', 
      function () {
        this.themeMusic.destroy();
        this.scene.start('AvatarSelect');
      }, 
      this
    );

    aboutButton.on(
      'pointerup', 
      function () {
        this.themeMusic.destroy();
        this.scene.start('AboutRoom');
      }, 
      this
    );
  }
}
