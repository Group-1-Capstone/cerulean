import Phaser from 'phaser';
import { io } from 'socket.io-client';

export default class ChatRoom extends Phaser.Scene {
  constructor(name, { store, socket }) {
    super({ key: "ChatRoom" });
    // this.store = store,
    this.socket = socket
    this.players = {}
    this.isClicking = false;
  }

  preload() {
    this.load.image('jessie', 'assets/jessieFront.png');
    // this.load.spritesheet('jessie', 'sprites/jessie.png', {
    //   frameWidth: 47,
    //   frameHeight: 63,
    // });
    this.load.image('exit', 'assets/exit.png')
  }

  create() {
    console.log("you're in the chatroom!")
    // console.log('store', this.store);
    
    const exit = this.physics.add.image(700, 100, "exit");
    
    function exitTouched() {
      console.log("touched exit func")
      this.scene.start("MainRoom");
    }
    
    const x = 100;
    const y = 300;
    this.player = this.physics.add.sprite(x, y, 'jessie');
    this.socket.emit('newPlayer', {x, y})

    this.physics.add.collider(this.player, exit, exitTouched, null, this);

    this.socket.on('playerJoined', (data) => {
      console.log('new player added', data);
      const newPlayer = this.physics.add.sprite(data.x, data.y, 'jessie');
      this.players[data.id] = newPlayer;
    });

    this.socket.on('playerMoved', (data) => {
      if (!this.players[data.id]) return;
      console.log('this.players', this.players[data.id]);
      const playerMoved = this.players[data.id];
      // const distance = Phaser.Math.Distance(playerMoved.x, playerMoved.y, data.x, data.y);
      const distance = Math.sqrt((playerMoved.x - data.x) ^ 2 + (playerMoved.y - data.y) ^2);
      this.add.tween(playerMoved).to(data, distance * 10).start();
      // this.players[data.id].setPosition(data.x, data.y);
      // this.players[data.id].setRotation(data.rotation);
    });


    // this.socket.on('allplayers', function (data) {
    //   for (var i = 0; i < data.length; i++) {
    //     Game.addNewPlayer(data[i].id, data[i].x, data[i].y);
    //   }
    // });

    // this.socket.on('remove', function (id) {
    //   Game.removePlayer(id);
    // });

    this.player.setCollideWorldBounds(true);
    
  }

  update() {
    //----CLICK TO TELEPORT --JANKY--------------------------------------------------------
    //NO ANIMATIONS on purpose!! Jessie facing backwards!
    if (!this.input.activePointer.isDown && this.isClicking == true) {
      this.player.setData("newX", this.input.activePointer.x);
      this.player.setData("newY", this.input.activePointer.y);
      this.isClicking = false;
    } else if (this.isClicking == false && this.input.activePointer.isDown) { 
      this.isClicking = true;
    }

     if (Math.abs(this.player.y - this.player.getData("newY")) <= 10) {
        this.player.y = this.player.getData("newY");
     } else if (this.player.y < this.player.getData("newY")) {
        this.player.y += 5;
     }  else if (this.player.y > this.player.getData("newY")) {
      this.player.y -= 5;
     } 

     if (Math.abs(this.player.x - this.player.getData("newX")) <= 10) {
      this.player.x = this.player.getData("newX");
    } else if (this.player.x < this.player.getData("newX")) {
      this.player.x += 5;
    } else if (this.player.x > this.player.getData("newX")) {
      this.player.x -= 5;
    }

    this.socket.emit('playerMovement', {x: this.player.x, y: this.player.y, rotation: this.player.rotation});
  
    //-----OLD PLAYER MOVEMENT ----------------------------------------------------------------
  //   const cursors = this.input.keyboard.createCursorKeys();
  //   if (cursors.left.isDown) {
  //     this.player.setVelocity(-160, 0);
  //     this.player.anims.play('left', true);
  //   } else if (cursors.right.isDown) {
  //     this.player.setVelocity(160, 0);
  //     this.player.anims.play('right', true);
  //   } else if (cursors.up.isDown) {
  //     this.player.setVelocity(0, -160);
  //     this.player.anims.play('up', true);
  //   } else if (cursors.down.isDown) {
  //     this.player.setVelocity(0, 160);
  //     this.player.anims.play('down', true);
  //   } else {
  //     this.player.setVelocity(0, 0);
  //     this.player.anims.play('turn');
  //   }
  // }
  // ---------------------------------------------------------------------------------------
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
}