import Phaser from 'phaser';
// import { io } from 'socket.io-client';

export default class MeditationRoom extends Phaser.Scene {
  constructor(name, { store, socket }) {
    super({ key: "MeditationRoom" });
    //why do we have "name" in constructor and super?
    // this.store = store,
    this.socket = socket
    this.isClicking = false;
  }

  preload() {
    this.load.image('medRoom', 'assets/meditationroom.png');
    this.load.image('exit', 'assets/exit.png')
    this.load.image('jessie', 'assets/jessieFront.png');
    // this.load.spritesheet('jessie', 'sprites/jessie.png', {
    //   frameWidth: 47,
    //   frameHeight: 63,
    // });
  }

  create() {
    
    this.add.image(400, 300, "medRoom");
  
    const exit = this.physics.add.image(700, 100, "exit");
    
    function exitTouched() {
      console.log("touched exit func")
      this.scene.start("MainRoom");
    }
    
    const x = 100;
    const y = 300;
    this.player = this.physics.add.sprite(x, y, 'jessie');
    
    this.physics.add.collider(this.player, exit, exitTouched, null, this);

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

}