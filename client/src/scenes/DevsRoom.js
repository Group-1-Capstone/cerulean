import Phaser from "phaser";

export default class DevsRoom extends Phaser.Scene {
  constructor() {
    super({ key: 'DevsRoom' });
  }

  preload() {
    // placeholder for background img: this.load.image('background', assets/background.png');
    this.load.image('blank', 'assets/blank.png');
    this.load.image('enter', 'assets/enter-button.png');
    // white versions of music buttons also in assets
    this.load.image('musicOn', 'assets/music_on_blk.png');
    this.load.image('musicOff', 'assets/music_off_blk.png');
    this.load.audio('themeMusic', 'assets/theme.mp3');
  }

  create() {
    const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
    
    const logo = this.add.image(screenCenterX, screenCenterY / 1, 'blank').setDepth(-1);

    const style = { font: '12pt Arial', fill: 'white', backgroundColor: 'rgb(105, 105, 105, .9)', align: 'center', wordWrap: true };

    const text = `\nThe App Developers
    
    Mary Anhalt:  linkedin.com/in/mary-anhalt  |  github.com/MayKay1   
    Daurie Basham:  linkedin.com/in/daurieb  |  github.com/dcbasham   
    Eve Holzgruber:  linkedin.com/in/eveholzgruber  |  github.com/eholz   
    Lisa Younes:  linkedin.com/in/lisayounes  |  github.com/HelloLisaNYC   
    
    We hope you enjoy Cerulean!\n`;

    const devsTextBox = this.add.text(screenCenterX, screenCenterY * .7, text, style).setOrigin(0.5).setDepth(1);
    const enterButton = this.add.image(screenCenterX, screenCenterY * 1.35, 'enter').setInteractive().setDepth(1);

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
  }
}
