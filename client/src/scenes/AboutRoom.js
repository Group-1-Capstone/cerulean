import Phaser from "phaser";

export default class AboutRoom extends Phaser.Scene {
  constructor() {
    super({ key: 'AboutRoom' });
  }

  preload() {
    // placeholder for background img: this.load.image('background', assets/background.png');
    this.load.image('logo', 'assets/logo.png');
    this.load.image('enter', 'assets/enter-button.png');
    this.load.image('devs', 'assets/devs-button.png');
    // white versions of music buttons also in assets
    this.load.image('musicOn', 'assets/music_on_blk.png');
    this.load.image('musicOff', 'assets/music_off_blk.png');
    this.load.audio('themeMusic', 'assets/theme.mp3');
  }

  create() {
    const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
    
    const logo = this.add.image(screenCenterX, screenCenterY / 2, 'logo').setDepth(1);

    const style = { font: '12pt Arial', fill: 'white', backgroundColor: 'rgb(105, 105, 105, .9)', align: 'center', wordWrap: true };

    const text = `\nCerulean is an engaging gaming app that fits your mood.
    Tap the screen or use your mouse/touchpad to navigate.
    Press Enter below to select your avatar, 
    and then you will be transported to your main room.
    Click the journal on the desk. 
    Here you will choose your mood and recommended activity. 
    You can return to your main room any time to try all the experiences.  
    Just click the doors to go directly to your preferred activity.
    
    Now begin your Cerulean experience!\n`;

    const aboutTextBox = this.add.text(screenCenterX, screenCenterY * 1.25, text, style).setOrigin(0.5).setDepth(1);
    const enterButton = this.add.image(300, screenCenterY * 1.85, 'enter').setInteractive().setDepth(1);
    const devsButton = this.add.image(500, screenCenterY * 1.85, 'devs').setInteractive().setDepth(1);

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

    devsButton.on(
      'pointerup', 
      function () {
        this.themeMusic.destroy();
        this.scene.start('DevsRoom');
      }, 
      this
    );
  }
}
