import { useRef, useEffect } from 'react';
import Phaser from 'phaser';

export default function usePhaser(config) {
  const game = useRef();
  const gameContainer = useRef(null);
  useEffect(() => {
    if (!game.current && gameContainer.current) {
      game.current = new Phaser.Game(
        Object.assign({ ...config }, { parent: gameContainer.current })
      );
    }
  }, [config]);
  return {
    game,
    gameContainer,
  };
}
