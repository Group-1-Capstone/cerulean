import { useRef, useEffect } from 'react';
import Phaser from 'phaser';
import Main from '../scenes/Main';

export default function usePhaser(config) {
  const game = useRef();
  // is this even doing anything ? isn't useRef supposed to have an argument ?
  const gameContainer = useRef(null);
  useEffect(() => {
    if (!game.current && gameContainer.current) {
      const socket = io.connect();
      const main = new Main('main', { store: 'store', socket });

      game.current = new Phaser.Game({
        ...config,
        parent: gameContainer.current,
        scene: main
      });
    }
  }, [config]);
  //   console.log(game);  === undefined
  return {
    game,
    gameContainer,
  };
}
