import { useRef, useEffect } from 'react';
import Phaser from 'phaser';
import ChatRoom from '../scenes/ChatRoom';
import MainRoom from '../scenes/MainRoom';
import MeditationRoom from '../scenes/MeditationRoom';
import GameRoom from '../scenes/GameRoom';
import AvatarSelect from '../scenes/AvatarSelect';
import HomeRoom from '../scenes/HomeRoom';
import AboutRoom from '../scenes/AboutRoom';
import DevsRoom from '../scenes/DevsRoom';

export default function usePhaser(config) {
  const game = useRef();

  const gameContainer = useRef(null);
  useEffect(() => {
    if (!game.current && gameContainer.current) {
      const homeRoom = new HomeRoom();
      const aboutRoom = new AboutRoom();
      const devsRoom = new DevsRoom();
      const avatarSelect = new AvatarSelect();
      const mainRoom = new MainRoom();
      const meditationRoom = new MeditationRoom();
      const chatRoom = new ChatRoom();
      const gameRoom = new GameRoom();
      game.current = new Phaser.Game({
        ...config,
        parent: gameContainer.current,
        scene: [homeRoom, aboutRoom, devsRoom, avatarSelect, mainRoom, meditationRoom, chatRoom, gameRoom],
      });
    }
  }, [config]);

  return {
    game,
    gameContainer,
  };
}
