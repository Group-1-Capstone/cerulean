import Phaser from 'phaser';
import { io } from 'socket.io-client';

export default class Main extends Phaser.Scene {
  constructor(name, { store, socket }) {
    super(name);
    // this.store = store,
    this.socket = socket;
    this.players = {};
      //everyone except ourself. TODO: change name to this.otherPlayers here and everywhere in this file. 
  }

  preload() {
    this.load.spritesheet('jessie', 'sprites/jessie.png', {
      frameWidth: 47,
      frameHeight: 63,
    });
  }

  create() {

    const x = 100;
    const y = 300;
    this.player = this.physics.add.sprite(x, y, 'jessie');
    
    // telling the server that i joined the game
    this.socket.emit('newPlayer', this.player);

    // the server telling me that a new player joined
    this.socket.on('playerJoined', (data) => {
      console.log('new player added', data.id);
      const newPlayer = this.physics.add.sprite(data.x, data.y, 'jessie');
      this.players[data.id] = newPlayer;
      console.log('players obj', this.players);
    });

    // the server telling me all the existing players and their locations
    this.socket.on('allPlayers', (allPlayers) => {
      console.log('got all players from server', allPlayers);

      Object.keys(allPlayers).forEach((socketID) => {
        console.log("adding this player to this.players:", socketID)
        let player = this.physics.add.sprite(allPlayers[socketID].x, allPlayers[socketID].y, 'jessie');
        this.players[socketID] = player
      });

      console.log("updated this.players:", this.players)
    });

    this.socket.on('removePlayer', (data) => {
      const player = this.players[data.id];
      player.destroy();
      console.log(`player ${data.id} left the game`);
      delete this.players[data.id]
    });

    this.socket.on('playerMoved', (data) => {
      this.players[data.id].setPosition(data.x, data.y);
      // this.players[data.id].setRotation(data.rotation);
    });

    this.player.setCollideWorldBounds(true);
    this.anims.create({
      key: 'turn',
      frames: [{ key: 'jessie', frame: 7 }],
      frameRate: 20,
    });
    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('jessie', { start: 3, end: 5 }),
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
    this.socket.emit('playerMovement', {
      x: this.player.x,
      y: this.player.y,
      rotation: this.player.rotation,
    });

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