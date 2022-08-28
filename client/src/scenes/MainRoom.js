import Phaser from 'phaser';
// import { io } from 'socket.io-client';

//FOR EVE ------------------------------------------------------------------------
//added popup code, currently not recognizing "this.add.button"
//if we can get this to work with different png instead of journal, that's fine
export default class MainRoom extends Phaser.Scene {
  constructor(name, { store, socket }) {
    super({ key: "MainRoom" });
    //why do we have "name" in constructor and super?
    // this.store = store,
    this.socket = socket
    this.isClicking = false;
    this.button;
    this.popup;
    this.tween = null;
  }

  preload() {
    this.load.image('room', 'assets/mainroom.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('jessie', 'assets/jessieFront.png');
    // this.load.spritesheet('jessie', 'sprites/jessie.png', {
    //   frameWidth: 47,
    //   frameHeight: 63,
    // });
    this.load.image('background', 'assets/journal.png');
    this.load.image('close', 'assets/button.png');
    this.load.image('button', 'assets/journal.png')
    this.load.image('chatDoor', 'assets/chatDoor.png')
    this.load.image('gameDoor', 'assets/gameDoor.png')
    this.load.image('medDoor', 'assets/medDoor.png')
    
  }

  create() {
    // console.log('store', this.store);
    this.add.image(400, 300, "room");
    
    const x = 100;
    const y = 300;
    this.player = this.physics.add.sprite(x, y, 'jessie');
    
    const gameDoor = this.physics.add.image(250, 100, "gameDoor");
    const chatDoor = this.physics.add.image(550, 100, "chatDoor");
    const medDoor = this.physics.add.image(700, 100, "medDoor");
    
    this.physics.add.collider(this.player, gameDoor, gameDoorTouched, null, this);
    this.physics.add.collider(this.player, chatDoor, chatDoorTouched, null, this);
    this.physics.add.collider(this.player, medDoor, medDoorTouched, null, this);
    //try with overlap instead of collider?
    
    function gameDoorTouched() {
      console.log("game door touched func")
      // this.scene.start("GameRoom");
    }
    
    function chatDoorTouched() {
      console.log("chat door touched func")
      this.scene.start("Main");
    }
    
    function medDoorTouched() {
      console.log("med touched func")
      this.scene.start("MeditationRoom");
    }
    
    const stars = this.physics.add.staticGroup();
    
    stars.create(200, 450, "star");
    
    this.physics.add.collider(this.player, stars, starTouched, null, this);
    
    function starTouched(player, star) {
      console.log("star touched func")
    }


    //button
    
    // this.button = this.add.button(400, 300, 'button', openWindow, this, 2, 1, 0);
    // //useHandCursor?
    // this.button.input.handCursor = true;

    // this.popup = this.add.sprite(400, 300, 'background');
    // this.popup.alpha = 0.8;
    // this.popup.anchor.set(0.5);
    // this.popup.inputEnabled = true;
    
    // let pw = (this.popup.width / 2) - 30;
    // let ph = (this.popup.height / 2) - 8;

    // //  And click the close button to close it down again
    // let closeButton = this.make.sprite(pw, -ph, 'close');
    // closeButton.inputEnabled = true;
    // closeButton.input.priorityID = 1;
    // closeButton.input.useHandCursor = true;
    // closeButton.events.onInputDown.add(closeWindow, this);

    // this.popup.addChild(closeButton);

    // //  Shrink popup
    // this.popup.scale.set(0.1);

    // function openWindow() {
    //   if ((this.tween !== null && this.tween.isRunning) || this.popup.scale.x === 1)
    // {
    //     return;
    // }
    // //  create tween to pop open window, if window is not popped already
    // this.tween = this.add.tween(this.popup.scale).to( { x: 1, y: 1 }, 1000, Phaser.Easing.Elastic.Out, true);
    // }

    // function closeWindow() {
    //   if (this.tween && this.tween.isRunning || this.popup.scale.x === 0.1)
    //   {
    //       return;
    //   }
    //   //  Create a tween that will close the window, if not closed
    //   this.tween = this.add.tween(this.popup.scale).to( { x: 0.1, y: 0.1 }, 500, Phaser.Easing.Elastic.In, true);
  
    // }
    
    //TODO - add collider between star (journal) and player
    //on collision, enter Main game scene. 
    //on collision, open journal with choice of feelings
    
    // use setTint method to make the journal glow?
    //e.g. setTint(0xff0000); 0x + hexcode

    
    const journalText = this.add.text(300, 550, "Click the journal", {
      fontSize: "32px",
      fill: "#EE3D73",  //font color
    });

   

    this.player.setCollideWorldBounds(true);
    
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

    
    
    // this.anims.create({
    //   key: 'turn',
    //   frames: [{ key: 'jessie', frame: 7 }],
    //   frameRate: 20,
    // });
    // this.anims.create({
    //   key: 'right',
    //   frames: this.anims.generateFrameNumbers('jessie', { start: 3, end: 5 }),
    //   frameRate: 10,
    //   repeat: -1,
    // });
    // this.anims.create({
    //   key: 'left',
    //   frames: this.anims.generateFrameNumbers('jessie', { start: 9, end: 11 }),
    //   frameRate: 10,
    //   repeat: -1,
    // });
    // this.anims.create({
    //   key: 'up',
    //   frames: this.anims.generateFrameNumbers('jessie', { start: 0, end: 2 }),
    //   frameRate: 10,
    //   repeat: -1,
    // });
    // this.anims.create({
    //   key: 'down',
    //   frames: this.anims.generateFrameNumbers('jessie', { start: 6, end: 8 }),
    //   frameRate: 10,
    //   repeat: -1,
    // });
  }

  

  update() {
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