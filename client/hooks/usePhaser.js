// import { useRef, useEffect } from 'react';
// import Phaser from 'phaser';
// import ChatRoom from '../scenes/ChatRoom';
// import MainRoom from '../scenes/MainRoom';
// import MeditationRoom from '../scenes/MeditationRoom';
// import GameRoom from '../scenes/GameRoom';

// export default function usePhaser(config) {
//   const game = useRef();

//   const gameContainer = useRef(null);
//   useEffect(() => {
//     // check if the game has been initialized- checking the dom.
//     //we are not changing the config.
//     if (!game.current && gameContainer.current) {
//       const socket = io.connect();
//       const mainRoom = new MainRoom('mainRoom', { store: 'store' });
//       const meditationRoom = new MeditationRoom('meditationRoom', {
//         store: 'store',
//       });
//       const chatRoom = new ChatRoom('chatRoom', { store: 'store', socket });
//       // const gameRoom = new GameRoom('gameRoom', {socket})
//       const gameRoom = new GameRoom('gameRoom', { socket });
//       game.current = new Phaser.Game({
//         ...config,
//         parent: gameContainer.current,
//         // scene: [gameRoom],
//         scene: [mainRoom, meditationRoom, chatRoom, gameRoom],
//       });
//     }
//   }, [config]);
//   //   console.log(game);  === undefined
//   return {
//     game,
//     gameContainer,
//   };
// }
