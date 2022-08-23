import { useRef, useEffect } from 'react';
import Phaser from 'phaser';

export default function usePhaser(config) {
  const game = useRef();
  // is this even doing anything ? isn't useRef supposed to have an argument ?
  const gameContainer = useRef(null);
  useEffect(() => {
    if (!game.current && gameContainer.current) {
      game.current = new Phaser.Game({
        ...config,
        parent: gameContainer.current,
      });
    }
  }, [config]);
  //   console.log(game);  === undefined
  return {
    game,
    gameContainer,
  };
}
