import Phaser from 'phaser';

export default class MainRoom extends Phaser.Scene {
  constructor() {
    super({ key: 'MainRoom' });
    this.isClicking = false;
  }

  init(data) {
    this.avatar = data.avatar;
  }

  preload() {
    this.load.plugin(
      'rexglowfilterpipelineplugin',
      'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexglowfilterpipelineplugin.min.js',
      true
    );
    this.load.image('room', 'assets/mainroom.png');
    this.load.image('journal', 'assets/journal_big.png');
    this.load.image('chatDoor', 'assets/doorLonely.png');
    this.load.image('gameDoor', 'assets/doorHappy.png');
    this.load.image('medDoor', 'assets/doorStressed.png');
    this.load.image('chatRoomButton', 'assets/lonelybtn.png');
    this.load.image('gameRoomButton', 'assets/happybtn.png');
    this.load.image('medRoomButton', 'assets/stressedbtn.png');
    this.load.image('miniJournal', 'assets/journal_tiny.png');
    this.load.image('musicOn', 'assets/music_on_blk.png');
    this.load.image('musicOff', 'assets/music_off_blk.png');

    this.load.image('avatar1', 'assets/avatar1.png');
    this.load.image('avatar2', 'assets/avatar2.png');
    this.load.image('avatar3', 'assets/avatar3.png');
    this.load.image('avatar4', 'assets/avatar4.png');

    this.load.audio('doorOpenSound', 'assets/doorOpen_2.ogg');
    this.load.audio('enterGameRoomSound', 'assets/dino/jingles_NES03.ogg');
    this.load.audio('themeMusic', 'assets/theme.mp3');
  }

  create() {
    this.add.image(650, 300, 'room');

    const x = 463;
    const y = 458;
    this.player = this.physics.add.sprite(x, y, this.avatar);

    const gameDoor = this.physics.add.image(1100, 158, 'gameDoor');
    const chatDoor = this.physics.add.image(950, 158, 'chatDoor');
    const medDoor = this.physics.add.image(800, 158, 'medDoor');

    this.doorOpenSound = this.sound.add('doorOpenSound');
    this.enterGameRoomSound = this.sound.add('enterGameRoomSound');

    this.themeMusic = this.sound.add('themeMusic', {
      volume: 0.25,
      loop: true,
    });
    
    this.musicOnButton = this.add.image(50, 50, 'musicOn').setScale(.5).setInteractive();
    this.musicOnButton.visible = true;

    this.musicOffButton = this.add.image(50, 50, 'musicOff').setScale(.5).setInteractive();
    this.musicOffButton.visible = false;

    function gameDoorTouched() {
      this.themeMusic.destroy();
      this.enterGameRoomSound.play();
      this.scene.start('GameRoom', { avatar: this.avatar });
    }

    function chatDoorTouched() {
      this.themeMusic.destroy();
      this.doorOpenSound.play();
      this.scene.start('ChatRoom', { avatar: this.avatar });
    }

    function medDoorTouched() {
      this.themeMusic.destroy();
      this.doorOpenSound.play();
      this.scene.start('MeditationRoom', { avatar: this.avatar });
    }

    this.physics.add.collider(
      this.player,
      gameDoor,
      gameDoorTouched,
      null,
      this
    );
    this.physics.add.collider(
      this.player,
      chatDoor,
      chatDoorTouched,
      null,
      this
    );
    this.physics.add.collider(this.player, medDoor, medDoorTouched, null, this);

    const star = this.physics.add.image(110, 380, 'miniJournal');
    this.physics.add.collider(this.player, star, starTouched, null, this);

    const { Between } = Phaser.Math;
    const postFxPlugin = this.plugins.get('rexglowfilterpipelineplugin');
    const pipeline = postFxPlugin.add(star);
    star.glowTask = star.scene.tweens.add({
      targets: pipeline,
      intensity: 0.02,
      ease: 'Linear',
      duration: Between(500, 1000),
      repeat: -1,
      yoyo: true,
    });

    function starTouched(player, star) {
      star.glowTask = star.scene.tweens.add({
        targets: pipeline,
        intensity: 0.0,
        ease: 'Linear',
        duration: 0,
        repeat: -1,
      });

      this.add.image(400, 300, 'journal');
      const promptText = this.add.text(200, 250, 'How are you feeling?', {
        fontSize: '32px',
        fill: '#EE3D73',
      });

      const chatRoomButton = this.add
        .image(150, 420, 'chatRoomButton')
        .setInteractive();
      const gameRoomButton = this.add
        .image(400, 420, 'gameRoomButton')
        .setInteractive();
      const medRoomButton = this.add
        .image(650, 420, 'medRoomButton')
        .setInteractive();

      chatRoomButton.on(
        'pointerup',
        function () {
          this.themeMusic.destroy();
          this.doorOpenSound.play();
          this.scene.start('ChatRoom', { avatar: this.avatar });
        },
        this
      );

      gameRoomButton.on(
        'pointerup',
        () => {
          this.themeMusic.destroy();
          this.enterGameRoomSound.play();
          this.scene.start('GameRoom', { avatar: this.avatar });
        },
        this
      );

      medRoomButton.on(
        'pointerup',
        function () {
          this.themeMusic.destroy();
          this.doorOpenSound.play();
          this.scene.start('MeditationRoom', { avatar: this.avatar });
        },
        this
      );
    }

    this.player.setCollideWorldBounds(true);

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
  }

  update() {
    if (!this.input.activePointer.isDown && this.isClicking == true) {
      this.player.setData('newX', this.input.activePointer.x);
      this.player.setData('newY', this.input.activePointer.y);
      this.isClicking = false;
    } else if (this.isClicking == false && this.input.activePointer.isDown) {
      this.isClicking = true;
    }

    if (Math.abs(this.player.y - this.player.getData('newY')) <= 10) {
      this.player.y = this.player.getData('newY');
    } else if (this.player.y < this.player.getData('newY')) {
      this.player.y += 5;
    } else if (this.player.y > this.player.getData('newY')) {
      this.player.y -= 5;
    }

    if (Math.abs(this.player.x - this.player.getData('newX')) <= 10) {
      this.player.x = this.player.getData('newX');
    } else if (this.player.x < this.player.getData('newX')) {
      this.player.x += 5;
    } else if (this.player.x > this.player.getData('newX')) {
      this.player.x -= 5;
    }
  }
}
