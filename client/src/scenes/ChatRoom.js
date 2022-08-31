import Phaser from 'phaser';
import { io } from 'socket.io-client';

//send button function
//input text field > update text
//append text as child to bubble?

export default class ChatRoom extends Phaser.Scene {
  constructor(name, { store, socket }) {
    super({ key: "ChatRoom" });
    // this.store = store,
    this.socket = socket;
    this.otherPlayers = {};
    this.isClicking = false;
    this.isTalking = false;
    this.bubble;
    this.content;
    this.bubbleWidth;
    this.bubbleHeight;
    this.input;
  }

  preload() {
    this.load.image('jessie', 'assets/jessieFront.png');
    this.load.image('exit', 'assets/exit.png')
    this.load.image('star', 'assets/star.png');
  }

  create() {
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

    //test speech bubble activation on button
    const star = this.physics.add.image(400, 300, "star");
    this.physics.add.collider(this.player, star, this.starTouched, null, this);
    //might change the way this is set later idk
    this.bubbleWidth = 350;
    this.bubbleHeight = 160;
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
    if (this.isTalking === true) {
      this.bubble.x = (this.player.x + 5);
      this.bubble.y = (this.player.y - 220);
      const b = this.content.getBounds();
      this.content.setPosition(this.bubble.x + (this.bubbleWidth / 2) - (b.width / 2), this.bubble.y + (this.bubbleHeight / 2) - (b.height / 2))
    }
  }

  starTouched(player, star) {
    const x = player.x + 5;
    const y = player.y - 220;
    this.createSpeechBubble(x, y, this.bubbleWidth, this.bubbleHeight, 'Help');
    this.isTalking = true;
    this.time.delayedCall(5000, this.destroySpeechBubble, null, this)
    star.destroy();
  }

  createSpeechBubble(x, y, w, h, quote) {
    const bubblePadding = 5;
    const arrowHeight = h/4;
    this.bubble = this.add.graphics({x: x, y: y});

    this.bubble.fillStyle(0x222222, 0.5);
    this.bubble.fillRoundedRect(6, 6, w, h, 16);

    //  Bubble color
    this.bubble.fillStyle(0xffffff, 1);
    //  Bubble outline line style
    this.bubble.lineStyle(4, 0x565656, 1);
    //  Bubble shape and outline
    this.bubble.strokeRoundedRect(0, 0, w, h, 16);
    this.bubble.fillRoundedRect(0, 0, w, h, 16);
    //  Calculate arrow coordinates
    const point1X = Math.floor(w / 7);
    const point1Y = h;
    const point2X = Math.floor((w / 7) * 2);
    const point2Y = h;
    const point3X = Math.floor(w / 7);
    const point3Y = Math.floor(h + arrowHeight);
    //  Bubble arrow shadow
    this.bubble.lineStyle(4, 0x222222, 0.5);
    this.bubble.lineBetween(point2X - 1, point2Y + 6, point3X + 2, point3Y);
    //  Bubble arrow fill
    this.bubble.fillTriangle(point1X, point1Y, point2X, point2Y, point3X, point3Y);
    this.bubble.lineStyle(2, 0x565656, 1);
    this.bubble.lineBetween(point2X, point2Y, point3X, point3Y);
    this.bubble.lineBetween(point1X, point1Y, point3X, point3Y);

    this.content = this.add.text(0, 0, quote, { fontFamily: 'Arial', fontSize: 20, color: '#000000', align: 'center', wordWrap: { width: w - (bubblePadding * 2) } });

    const b = this.content.getBounds();

    this.content.setPosition(this.bubble.x + (w / 2) - (b.width / 2), this.bubble.y + (h / 2) - (b.height / 2))
  }

  //destroy current bubble, re-activate button. may switch to setEnabled()/disableEnabled() ?
  destroySpeechBubble() {
    this.isTalking = false;
    this.bubble.destroy();
    this.content.destroy();
    const star = this.physics.add.image(400, 300, "star");
    this.physics.add.collider(this.player, star, this.starTouched, null, this);
  }
}