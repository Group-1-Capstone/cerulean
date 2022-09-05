import { useRef, useEffect } from 'react';
import Phaser from 'phaser';
import ChatRoom from '../scenes/ChatRoom';
import MainRoom from '../scenes/MainRoom';
import MeditationRoom from '../scenes/MeditationRoom';
import GameRoom from '../scenes/GameRoom';

export default function usePhaser(config) {
  const game = useRef();

  const gameContainer = useRef(null);
  useEffect(() => {
    if (!game.current && gameContainer.current) {
      const mainRoom = new MainRoom('mainRoom', { store: 'store' });
      const meditationRoom = new MeditationRoom('meditationRoom', {
        store: 'store',
      });
      const chatRoom = new ChatRoom('chatRoom', { store: 'store' });
      const gameRoom = new GameRoom('gameRoom', {});
      game.current = new Phaser.Game({
        ...config,
        parent: gameContainer.current,
        scene: [mainRoom, meditationRoom, chatRoom, gameRoom],
      });
    }
  }, [config]);

  return {
    game,
    gameContainer,
  };
}
