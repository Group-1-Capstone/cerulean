import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useFullscreen } from 'ahooks';
// import styles from './Game.module.css';
// // import config from '../config';
// // import usePhaser from '../hooks/usePhaser';
import Game from './src/index';
import config from './src/config';
import { BrowserRouter } from 'react-router-dom';

export default function App() {
  // const game = useRef();
  // const gameContainer = useRef();
  // const [isFullscreen, { toggleFullscreen }] = useFullscreen(gameContainer);
  // useEffect(() => {
  //   if (!game.current && gameContainer.current) {
  //     game.current = new Game({ parent: gameContainer.current, ...config });

  //     return { game, gameContainer };
  //   }
  // }, [config]);
  return (
    <div className={styles.game}>
      <div
        className={styles.gameContainer}
        ref={gameContainer}
        id="gameContainer"
      >
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
  );
}
ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('app')
);
