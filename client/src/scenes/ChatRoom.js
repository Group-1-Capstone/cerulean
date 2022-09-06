import Phaser from 'phaser';
import { io } from 'socket.io-client';

export default class ChatRoom extends Phaser.Scene {
  constructor(name, { store }) {
    super({ key: 'ChatRoom' });
    // this.store = store,
    this.otherPlayers = {};
    this.speechBubbles = {};
    this.speechBubble = {};
    this.bubbleWidth = 350;
    this.bubbleHeight = 160;
    this.inputText = '';
    this.topOnly = true;
  }

  preload() {
    this.load.html('textInput', 'assets/textInput.html');

    this.load.image('jessie', 'assets/jessieFront.png');
    this.load.image('avatar2', 'assets/jessieFront.png');
    this.load.image('avatar3', 'assets/jessieFront.png');
    this.load.image('avatar4', 'assets/jessieFront.png');

    this.load.image('exit', 'assets/exit.png');
    this.load.image('star', 'assets/star.png');

    this.load.audio('exitSound', 'assets/doorClose_1.ogg');
  }

  create() {
    this.socket = io.connect();

    const sceneFrame = this.add.rectangle(400, 300, 800, 600);
    sceneFrame.setDepth(0);
    const chatZone = this.add.rectangle(50, 550, 400, 100);
    chatZone.setDepth(1);

    sceneFrame.setInteractive().on(
      'pointerup',
      function (pointer, localX, localY) {
        this.player.setData('newX', localX);
        this.player.setData('newY', localY);
      },
      this
    );
    chatZone.setInteractive();
    const exit = this.physics.add.image(700, 100, 'exit');

    this.exitSound = this.sound.add('exitSound');

    function exitTouched() {
      this.exitSound.play();
      this.socket.disconnect();
      this.scene.start('MainRoom');
    }

    const x = 100;
    const y = 300;
    this.player = this.physics.add.sprite(x, y, 'jessie');
    //avatar received from mainroom

    this.physics.add.collider(this.player, exit, exitTouched, null, this);

    // telling the server that i joined the game
    this.socket.emit('newPlayer', this.player);

    // server telling me a new player joined
    this.socket.on('playerJoined', (data) => {
      console.log('new player data', data);
      //we want data.textureKey which is "jessie"
      const newPlayer = this.physics.add.sprite(data.x, data.y, 'jessie');
      // const newPlayer = this.physics.add.sprite(
      //   data.x,
      //   data.y,
      //   `${data.textureKey}`
      // );
      this.otherPlayers[data.id] = newPlayer;
    });

    // the server telling me all the existing players and their locations
    this.socket.on('allPlayers', (allPlayers) => {
      console.log('allplayers data', allPlayers);
      Object.keys(allPlayers).forEach((socketID) => {
        let player = this.physics.add.sprite(
          allPlayers[socketID].x,
          allPlayers[socketID].y,
          'jessie'
        );
        // let player = this.physics.add.sprite(
        //   allPlayers[socketID].x,
        //   allPlayers[socketID].y,
        //   `${allPlayers[socketID].textureKey}`
        // );
        this.otherPlayers[socketID] = player;
      });
    });

    this.socket.on('messageSent', ({ message, id }) => {
      this.speechBubbles[id] = this.speechBubbles[id] || {};
      this.speechBubbles[id] = this.sendMessage(message, id);
    });

    this.socket.on('removePlayer', (data) => {
      const player = this.otherPlayers[data.id];
      player.destroy();
    });

    this.socket.on('playerMoved', (data) => {
      const player = this.otherPlayers[data.id];
      player.setPosition(data.x, data.y);
      if (player.getData('isTalking')) {
        this.moveBubble(data.id);
      }
    });

    this.player.setCollideWorldBounds(true);

    //writing a chat message
    const inputField = this.add.dom(130, 550).createFromCache('textInput');
    inputField.setDepth(1);
    inputField.addListener('click');
    inputField.on(
      'click',
      function (event) {
        if (event.target.name === 'sendButton') {
          const element = inputField.getChildByName('textField');
          this.inputText = element.value;
          if (this.inputText !== '' && this.inputText.length < 250) {
            this.speechBubble = this.sendMessage(this.inputText);
            element.value = '';
            this.socket.emit('messageSent', this.inputText);
          }
        }
      },
      this
    );
  }

  update() {
    if (this.player.getData('isTalking')) {
      this.moveBubble();
    }

    //movement
    if (Math.abs(this.player.y - this.player.getData('newY')) <= 10) {
      this.player.y = this.player.getData('newY');
    } else if (this.player.y < this.player.getData('newY')) {
      this.player.y += 5;
      this.socket.emit('playerMovement', {
        x: this.player.x,
        y: this.player.y,
        rotation: this.player.rotation,
      });
    } else if (this.player.y > this.player.getData('newY')) {
      this.player.y -= 5;
      this.socket.emit('playerMovement', {
        x: this.player.x,
        y: this.player.y,
        rotation: this.player.rotation,
      });
    }

    if (Math.abs(this.player.x - this.player.getData('newX')) <= 10) {
      this.player.x = this.player.getData('newX');
    } else if (this.player.x < this.player.getData('newX')) {
      this.player.x += 5;
      this.socket.emit('playerMovement', {
        x: this.player.x,
        y: this.player.y,
        rotation: this.player.rotation,
      });
    } else if (this.player.x > this.player.getData('newX')) {
      this.player.x -= 5;
      this.socket.emit('playerMovement', {
        x: this.player.x,
        y: this.player.y,
        rotation: this.player.rotation,
      });
    }
  }

  moveBubble(playerId) {
    const { player, bubble, content } = this.getSpeechBubble(playerId);
    if (player.getData('isTalking') && content && bubble) {
      bubble.x = player.x + 5;
      bubble.y = player.y - 220;
      const b = content.getBounds();
      content.setPosition(
        bubble.x + this.bubbleWidth / 2 - b.width / 2,
        bubble.y + this.bubbleHeight / 2 - b.height / 2
      );
    }
  }

  getSpeechBubble(playerId) {
    const player = playerId ? this.otherPlayers[playerId] : this.player;
    const { bubble, content, expirationTimer } = playerId
      ? this.speechBubbles[playerId]
      : this.speechBubble;
    return { player, bubble, content, expirationTimer };
  }

  //send the input to bubble, reset input to ''
  sendMessage(message, playerId) {
    const { player, bubble, content, expirationTimer } =
      this.getSpeechBubble(playerId);

    const x = player.x + 5;
    const y = player.y - 220;

    if (player.getData('isTalking') && content && bubble) {
      content.text = message;
      expirationTimer.destroy();
      return {
        bubble,
        content,
        expirationTimer: this.time.delayedCall(
          5000,
          () => this.destroySpeechBubble(playerId),
          null,
          this
        ),
      };
    }

    //sets isTalking prop on player obj to true
    player.setData('isTalking', true);

    return {
      ...this.createSpeechBubble(
        x,
        y,
        this.bubbleWidth,
        this.bubbleHeight,
        message
      ),
      expirationTimer: this.time.delayedCall(
        5000,
        () => this.destroySpeechBubble(playerId),
        null,
        this
      ),
    };
  }

  createSpeechBubble(x, y, w, h, quote) {
    const bubblePadding = 5;
    const arrowHeight = h / 4;
    const bubble = this.add.graphics({ x: x, y: y });
    bubble.fillStyle(0x222222, 0.5);
    bubble.fillRoundedRect(6, 6, w, h, 16);

    //  Bubble color
    bubble.fillStyle(0xffffff, 1);
    //  Bubble outline line style
    bubble.lineStyle(4, 0x565656, 1);
    //  Bubble shape and outline
    bubble.strokeRoundedRect(0, 0, w, h, 16);
    bubble.fillRoundedRect(0, 0, w, h, 16);
    //  Calculate arrow coordinates
    const point1X = Math.floor(w / 7);
    const point1Y = h;
    const point2X = Math.floor((w / 7) * 2);
    const point2Y = h;
    const point3X = Math.floor(w / 7);
    const point3Y = Math.floor(h + arrowHeight);
    //  Bubble arrow fill
    bubble.fillTriangle(point1X, point1Y, point2X, point2Y, point3X, point3Y);
    bubble.lineStyle(2, 0x565656, 1);
    bubble.lineBetween(point2X, point2Y, point3X, point3Y);
    bubble.lineBetween(point1X, point1Y, point3X, point3Y);

    const content = this.add.text(0, 0, quote, {
      fontFamily: 'Arial',
      fontSize: 20,
      color: '#000000',
      align: 'center',
      wordWrap: { width: w - bubblePadding * 2 },
    });

    const b = content.getBounds();

    content.setPosition(
      bubble.x + w / 2 - b.width / 2,
      bubble.y + h / 2 - b.height / 2
    );

    return { bubble, content };
  }

  //destroy current bubble
  destroySpeechBubble(playerId) {
    const { player, bubble, content } = this.getSpeechBubble(playerId);
    player.setData('isTalking', false);
    if (bubble) {
      bubble.destroy();
    }
    if (content) {
      content.destroy();
    }
    if (player === this.player) {
      this.speechBubble = {};
    } else {
      this.speechBubbles[playerId] = {};
    }
  }
}
