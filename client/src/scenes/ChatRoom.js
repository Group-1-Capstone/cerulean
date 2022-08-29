import Phaser from 'phaser';
import { io } from 'socket.io-client';

export default class ChatRoom extends Phaser.Scene {
  constructor(name, { store, socket }) {
    super({ key: "ChatRoom" });
    // this.store = store,
    this.socket = socket;
    this.otherPlayers = {};
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
    
    this.physics.add.collider(this.player, exit, exitTouched, null, this);
    
    // telling the server that i joined the game
    this.socket.emit('newPlayer', this.player);

    this.socket.on('playerJoined', (data) => {
      const newPlayer = this.physics.add.sprite(data.x, data.y, 'jessie');
      this.otherPlayers[data.id] = newPlayer;
    });

    // the server telling me all the existing players and their locations
    this.socket.on('allPlayers', (allPlayers) => {
      console.log('got all players from server', allPlayers);

      Object.keys(allPlayers).forEach((socketID) => {
        let player = this.physics.add.sprite(allPlayers[socketID].x, allPlayers[socketID].y, 'jessie');
        this.otherPlayers[socketID] = player
      });
    });

    this.socket.on('removePlayer', (data) => {
      const player = this.otherPlayers[data.id];
      player.destroy();
      console.log(`player ${data.id} left the game`);
      delete this.otherPlayers[data.id]
    });

    this.socket.on('playerMoved', (data) => {
      this.otherPlayers[data.id].setPosition(data.x, data.y);
      // this.otherPlayers[data.id].setRotation(data.rotation);
    });

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
        this.socket.emit('playerMovement', {x: this.player.x, y: this.player.y, rotation: this.player.rotation});
     }  else if (this.player.y > this.player.getData("newY")) {
      this.player.y -= 5;
      this.socket.emit('playerMovement', {x: this.player.x, y: this.player.y, rotation: this.player.rotation});
     } 

     if (Math.abs(this.player.x - this.player.getData("newX")) <= 10) {
      this.player.x = this.player.getData("newX");
    } else if (this.player.x < this.player.getData("newX")) {
      this.player.x += 5;
      this.socket.emit('playerMovement', {x: this.player.x, y: this.player.y, rotation: this.player.rotation});
    } else if (this.player.x > this.player.getData("newX")) {
      this.player.x -= 5;
      this.socket.emit('playerMovement', {x: this.player.x, y: this.player.y, rotation: this.player.rotation});
    }
  
    //-----OLD PLAYER KEYBOARD MOVEMENT ----------------------------------------------------------------
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

}