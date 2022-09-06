/** @type {import ("../typings/phaser")} */
// the above loads the phaser.d.ts file so that VSCode has autocomplete for the phaser API. You
//may need to open the file and scroll up and down in it if it doesn't work at first.
import 'phaser';
import config from './config';
// import { useFullscreen } from 'ahooks';
import MainRoom from './scenes/MainRoom';
import ChatRoom from './scenes/ChatRoom';
import GameRoom from './scenes/GameRoom';
import MeditationRoom from './scenes/MeditationRoom';

export default class Game extends Phaser.Game {
  constructor() {
    super(config);
    // Add all the scenes
    this.scene.add('MainRoom', MainRoom);
    this.scene.add('ChatRoom', ChatRoom);
    this.scene.add('GameRoom', GameRoom);
    this.scene.add('MeditationRoom', MeditationRoom);
    //start the game with the MainScene
    this.scene.start('MainRoom');
    // CREATE SOCKET
  }

  // PASS CHATROOM OUR SOCKET, LAUNCH
}
// create a new instance of the game
window.onload = function () {
  window.game = new Game();
};
