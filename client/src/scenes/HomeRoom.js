import Phaser from "phaser";

export default class HomeRoom extends Phaser.Scene {
  constructor() {
    super({ key: 'HomeRoom' });
  }

  preload() {
    // placeholder for background img: this.load.image('background', assets/background.png');
    this.load.image('logo', 'assets/logo.png');
    this.load.image('enter', 'assets/enter-button.png');
    this.load.image('about', 'assets/about-button.png');
    // white versions of music buttons also in assets
    this.load.image('musicOn', 'assets/music_on_blk.png');
    this.load.image('musicOff', 'assets/music_off_blk.png');
    this.load.audio('themeMusic', 'assets/theme.mp3');
  }

  create() {
    // these put x and y at screen center:
    const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
    const logo = this.add.image(screenCenterX, screenCenterY, 'logo').setDepth(-1);
    
    // attempt at using relative spacing vs static x and y coordinates:
    const enterButton = this.add.image(550, screenCenterY * 1.45, 'enter').setInteractive().setDepth(1);
    const aboutButton = this.add.image(750, screenCenterY * 1.45, 'about').setInteractive().setDepth(1);

    // with static x and y coordinates:
    // const enterButton = this.add.image(300, 450, 'enter').setInteractive().setDepth(1);
    // const aboutButton = this.add.image(500, 450, 'about').setInteractive().setDepth(1);
    
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
