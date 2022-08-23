import Phaser from 'phaser';
import { io } from 'socket.io-client';

export default class Main extends Phaser.Scene {
  constructor() {
    super('main');
  }

  preload() {
    this.load.spritesheet('jessie', 'sprites/jessie.png', {
      frameWidth: 47,
      frameHeight: 63,
    });
  }

  create() {
    this.player = this.physics.add.sprite(100, 300, 'jessie');
    this.player.setCollideWorldBounds(true);
    this.anims.create({
      key: 'turn',
      frames: [{ key: 'jessie', frame: 7 }],
      frameRate: 20,
    });
    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('jessie', { start: 3, end: 5,}),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('jessie', { start: 9, end: 11 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: 'up',
      frames: this.anims.generateFrameNumbers('jessie', { start: 0, end: 2 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: 'down',
      frames: this.anims.generateFrameNumbers('jessie', { start: 6, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });
  }

  update() {
    const cursors = this.input.keyboard.createCursorKeys();
    if (cursors.left.isDown) {
      this.player.setVelocity(-160, 0);
      this.player.anims.play('left', true);
    } else if (cursors.right.isDown) {
      this.player.setVelocity(160, 0);
      this.player.anims.play('right', true);
    } else if (cursors.up.isDown) {
      this.player.setVelocity(0, -160);
      this.player.anims.play('up', true);
    } else if (cursors.down.isDown) {
      this.player.setVelocity(0, 160);
      this.player.anims.play('down', true);
    } else {
      this.player.setVelocity(0, 0);
      this.player.anims.play('turn');
    }
  }
}

const clientSocket = io(window.location.origin);
clientSocket.on('connect', () => {
  console.log('Socket connected to server');
}); // socket connections in scenes- Main.js in client. Open socket connection this.socket= new Socket.io..... create function.
/* A new Manager? https://socket.io/docs/v4/client-api/
 */
