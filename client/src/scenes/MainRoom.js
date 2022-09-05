import Phaser from 'phaser';

export default class MainRoom extends Phaser.Scene {
  constructor(name, { store }) {
    super({ key: 'MainRoom' });
    // this.store = store,
    this.isClicking = false;
  }

  preload() {
    this.load.plugin(
      'rexglowfilterpipelineplugin',
      'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexglowfilterpipelineplugin.min.js',
      true
    );
    this.load.image('room', 'assets/mainroom.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('jessie', 'assets/jessieFront.png');
    this.load.image('journal', 'assets/journal.png');
    this.load.image('chatDoor', 'assets/chatDoor.png');
    this.load.image('gameDoor', 'assets/gameDoor.png');
    this.load.image('medDoor', 'assets/medDoor.png');
    this.load.image('chatRoomButton', 'assets/chatRoomButton.png');
    this.load.image('gameRoomButton', 'assets/gameRoomButton.png');
    this.load.image('medRoomButton', 'assets/medRoomButton.png');
  }

  create() {
    this.add.image(400, 300, 'room');

    const x = 463;
    const y = 458;
    this.player = this.physics.add.sprite(x, y, 'jessie');

    const gameDoor = this.physics.add.image(250, 100, 'gameDoor');
    const chatDoor = this.physics.add.image(550, 100, 'chatDoor');
    const medDoor = this.physics.add.image(700, 100, 'medDoor');

    function gameDoorTouched() {
      this.scene.start('GameRoom');
    }

    function chatDoorTouched() {
      this.scene.start('ChatRoom');
    }

    function medDoorTouched() {
      this.scene.start('MeditationRoom');
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

    // star is a placeholder for the small journal that opens up on collision
    // const star = this.physics.add.image(400, 250, "star");
    const star = this.physics.add.image(700, 300, 'star');
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
      // disable glow
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
        fill: '#EE3D73', // font color
      });

      const chatRoomButton = this.add
        .image(100, 450, 'chatRoomButton')
        .setInteractive();
      const gameRoomButton = this.add
        .image(400, 450, 'gameRoomButton')
        .setInteractive();
      const medRoomButton = this.add
        .image(700, 450, 'medRoomButton')
        .setInteractive();

      // TODO: in the button function, store the response in DB
      // if we wanted only the one door to appear after clicking button and player enters on their own:
      // see commented code under medRoomButton

      chatRoomButton.on(
        'pointerup',
        function () {
          this.scene.start('ChatRoom');
        },
        this
      );

      gameRoomButton.on(
        'pointerup',
        () => {
          this.scene.start('GameRoom');
        },
        this
      );

      medRoomButton.on(
        'pointerup',
        function () {
          this.scene.start('MeditationRoom');
          // if we wanted the door to appear after clicking button and player enters on their own:
          // const medDoor = this.physics.add.image(700, 100, "medDoor");
          // this.physics.add.collider(this.player, medDoor, medDoorTouched, null, this);
        },
        this
      );
    }

    const journalText = this.add.text(
      150,
      550,
      'Walk over to the star/journal',
      {
        fontSize: '32px',
        fill: '#EE3D73', // font color
      }
    );

    this.player.setCollideWorldBounds(true);
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
