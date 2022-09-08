import React from 'react';
import styles from './Game.module.css';
import config from '../config';
import usePhaser from '../hooks/usePhaser';

export default function Game() {
  const { game, gameContainer } = usePhaser(config);

  return (
    <div className={styles.game}>
      <div
        className={styles.gameContainer}
        ref={gameContainer}
        id='gameContainer'>
        <header>
        </header>
      </div>
    </div>
  );
}
