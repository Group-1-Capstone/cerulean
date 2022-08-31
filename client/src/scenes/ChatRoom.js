import Phaser from 'phaser';
import { io } from 'socket.io-client';

//get timer to reset when new message is sent BEFORE old one disappears
//get movement to disable when clicking text field or send button

export default class ChatRoom extends Phaser.Scene {
  constructor(name, { store, socket }) {
    super({ key: "ChatRoom" });
    // this.store = store,
    this.socket = socket;
    this.otherPlayers = {};
    this.isTalking = false;
    this.bubble;
    this.content;
    this.bubbleWidth = 350;
    this.bubbleHeight = 160;
    this.inputText = '';
    this.topOnly = true;
  }

  preload() {
    //text input
    this.load.html('textInput', 'assets/textInput.html');
    this.load.image('jessie', 'assets/jessieFront.png');
    this.load.image('exit', 'assets/exit.png')
    this.load.image('star', 'assets/star.png');
  }  
  
  create() {
    //spread something across screen????
    const sceneFrame = this.add.rectangle(400, 300, 800, 600);
    sceneFrame.setDepth(0);
    const chatZone = this.add.rectangle(50, 550, 400, 100);
    chatZone.setDepth(1);

    sceneFrame.setInteractive().on('pointerup', function (pointer, localX, localY) {
        this.player.setData("newX", localX);
        this.player.setData("newY", localY)
  }, this);
  chatZone.setInteractive();
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

    //text
    const inputField = this.add.dom(130, 550).createFromCache('textInput');
    inputField.setDepth(1);
    inputField.addListener('click');
    inputField.on('click', function (event) {
      if (event.target.name === 'sendButton')
        {
          const element = inputField.getChildByName('textField');
         this.inputText = element.value;
      }}, this);
  }

  update() {
      //when input changes, fires once - create bubble
      if (this.inputText !== '') {
        //maybe send time - drew
        this.sendMessage(this.player);
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

  //send the input to bubble, reset input to ''
  sendMessage(player) {
    const x = player.x + 5;
    const y = player.y - 220;
    if (this.bubble) {
      this.destroySpeechBubble();
    }
    //otherwise, create one and destroy after 5 seconds
    this.createSpeechBubble(x, y, this.bubbleWidth, this.bubbleHeight, this.inputText)
    this.inputText= '';
    this.isTalking = true;
    this.time.delayedCall(5000, this.destroySpeechBubble, null, this);
    //get epoch time, when current time is >= epoch time destroy message - drew
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
    //  Bubble arrow fill
    this.bubble.fillTriangle(point1X, point1Y, point2X, point2Y, point3X, point3Y);
    this.bubble.lineStyle(2, 0x565656, 1);
    this.bubble.lineBetween(point2X, point2Y, point3X, point3Y);
    this.bubble.lineBetween(point1X, point1Y, point3X, point3Y);

    this.content = this.add.text(0, 0, quote, { fontFamily: 'Arial', fontSize: 20, color: '#000000', align: 'center', wordWrap: { width: w - (bubblePadding * 2) } });

    const b = this.content.getBounds();

    this.content.setPosition(this.bubble.x + (w / 2) - (b.width / 2), this.bubble.y + (h / 2) - (b.height / 2))
  }

  //destroy current bubble
  destroySpeechBubble() {
    this.isTalking = false;
    if (this.bubble) {
      this.bubble.destroy();
    }
    this.bubble = undefined;
    this.content.destroy();
  }
}