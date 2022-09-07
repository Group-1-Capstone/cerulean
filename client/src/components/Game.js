import React, { useEffect, useState } from 'react';
import { useFullscreen } from 'ahooks';
import styles from './Game.module.css';
import config from '../config';
import usePhaser from '../hooks/usePhaser';

export default function Game() {
  const { game, gameContainer } = usePhaser(config);
  const [isFullscreen, { toggleFullscreen }] = useFullscreen(gameContainer);
  const [score, setScore] = useState(0);

  // useEffect(() => {
  //   SocketCommands(game.current);
  // }, [game]);

  return (
    <div className={styles.game}>
      <div
        //style={{ border: '2px solid red' }}
        className={styles.gameContainer}
        ref={gameContainer}
        id='gameContainer'>
        <header>
        </header>
      </div>
    </div>
  );
}
