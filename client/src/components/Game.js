import React, { useEffect } from 'react';
import { useState } from "react"
import styles from "./Game.module.css"
import config from "../config"
import usePhaser from "../hooks/usePhaser"
import { useFullscreen } from "ahooks"
import SocketCommands from '../scenes/SocketCommands';

export default function Game() {
  const { game, gameContainer } = usePhaser(config)
  const [isFullscreen, { toggleFullscreen }] = useFullscreen(gameContainer)
  const [score, setScore] = useState(0)
  
  // useEffect(() => {
  //   SocketCommands(game.current);
  // }, [game]);

  return (
    <div className={styles.game}>
      <div className={styles.gameContainer} ref={gameContainer}>
        <header>
          <h1>Game Title</h1>
          <div className={styles.score}>{score}</div>
        </header>
        <footer>
          <button
            className={styles.fullscreenButton}
            onClick={() => toggleFullscreen()}
          >
            {isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          </button>
        </footer>
      </div>
    </div>
  )
}