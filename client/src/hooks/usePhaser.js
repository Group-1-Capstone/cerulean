import { useRef, useEffect } from 'react';
import Phaser from 'phaser';
import ChatRoom from '../scenes/ChatRoom';
import MainRoom from '../scenes/MainRoom';
import MeditationRoom from '../scenes/MeditationRoom';

export default function usePhaser(config) {
  const game = useRef();
  // is this even doing anything ? isn't useRef supposed to have an argument ?
  const gameContainer = useRef(null);
  useEffect(() => {
    if (!game.current && gameContainer.current) {
      const socket = io.connect();
      const mainRoom = new MainRoom('mainRoom', { store: 'store'});
      const meditationRoom = new MeditationRoom('meditationRoom', { store: 'store'});
      const chatRoom = new ChatRoom('chatRoom', { store: 'store', socket });

      game.current = new Phaser.Game({
        ...config,
        parent: gameContainer.current,
        scene: [mainRoom, meditationRoom, chatRoom] //main
      });
    }
  }, [config]);
  //   console.log(game);  === undefined
  return {
    game,
    gameContainer,
  };
}
