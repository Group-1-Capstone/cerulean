import Phaser from 'phaser';
import { io } from 'socket.io-client';

export default class Main extends Phaser.Scene {
  constructor(name, { store, socket }) {
    super(name);
    // this.store = store,
    this.socket = socket;
    this.players = {};
  }

  preload() {
    this.load.spritesheet('jessie', 'sprites/jessie.png', {
      frameWidth: 47,
      frameHeight: 63,
    });
  }

  create() {
    // console.log('store', this.store);

    const x = 100;
    const y = 300;
    this.player = this.physics.add.sprite(x, y, 'jessie');
    // this.socket.emit('newPlayer', {x, y})
    // console.log('this player', this.player);
    // console.log('socket id', this.socket.id)
    // doesn't display socket id in chrome console, but it does work in terminal console

    // telling the server that i joined the game
    this.socket.emit('newPlayer', this.player); // does the server know my socket id w.o me sending it? yes
    // this.socket.emit('newPlayer', this.player, this.socket.id)

    // this.otherPlayers = this.physics.add.group()

    // the server telling me that a new player joined
    this.socket.on('playerJoined', (data) => {
      console.log('new player added', data.id);
      const newPlayer = this.physics.add.sprite(data.x, data.y, 'jessie');
      // console.log("new player", newPlayer)
      this.players[data.id] = newPlayer;
      console.log('players obj', this.players);
    });

    // the server telling me all the existing players and their locations
    this.socket.on('allPlayers', (allPlayers) => {
      console.log('got all players from server', allPlayers);

      Object.keys(allPlayers).forEach((socketID) => {
        console.log("allplayers foreach", socketID)
        let player = this.physics.add.sprite(allPlayers[socketID].x, allPlayers[socketID].y, 'jessie');
        this.players[socketID] = player
        // this.players[socketID] = allPlayers[socketID]
      });

      console.log("this.players", this.players)
      // const newPlayer = this.physics.add.sprite(data.x, data.y, 'jessie');
      // this.players[data.id] = newPlayer;
      // console.log('updated players obj', this.players);
    });

    this.socket.on('removePlayer', (data) => {
      const player = this.players[data.id]; // look up the player by their id that server emits
      console.log("player to destroy", data.id)
      player.destroy();
      console.log(`player ${data.id} left the game`);
      delete this.players[data.id]
    });

    this.socket.on('playerMoved', (data) => {
      // console.log("player that moved", this.players[data.id])
      this.players[data.id].setPosition(data.x, data.y);
      // this.players[data.id].setRotation(data.rotation);
    });

    // this.socket.on('playerMoved', (data) => {
    //   if (!this.players[data.id]) return;
    //   console.log('this.players', this.players[data.id]);
    //   const playerMoved = this.players[data.id];
    //   // const distance = Phaser.Math.Distance(playerMoved.x, playerMoved.y, data.x, data.y);
    //   const distance = Math.sqrt((playerMoved.x - data.x) ^ 2 + (playerMoved.y - data.y) ^2);
    //   this.add.tween(playerMoved).to(data, distance * 10).start();
    //   // this.players[data.id].setPosition(data.x, data.y);
    //   // this.players[data.id].setRotation(data.rotation);
    // });

    // this.socket.on('allplayers', function (data) {
    //   for (var i = 0; i < data.length; i++) {
    //     Game.addNewPlayer(data[i].id, data[i].x, data[i].y);
    //   }
    // });

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

// const clientSocket = io(window.location.origin);

// // clientSocket.on('connect', () => {
// //   console.log('Socket connected to server');
// // });
// // socket connections in scenes- Main.js in client. Open socket connection this.socket= new Socket.io..... create function.
// /* A new Manager? https://socket.io/docs/v4/client-api/
//  */

// clientSocket.on('newplayer',function(data){
//   Game.addNewPlayer(data.id,data.x,data.y);
// });

// clientSocket.sendTest = function(){
//   console.log("test sent");
//   clientSocket.socket.emit('test');
// };

// clientSocket.askNewPlayer = function(){
//   clientSocket.socket.emit('newplayer');
// };

// clientSocket.sendClick = function(x,y){
// clientSocket.socket.emit('click',{x:x,y:y});
// };
