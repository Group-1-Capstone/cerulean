// import React, { useEffect, useState } from 'react';
// import { useFullscreen } from 'ahooks';
// // import styles from './Game.module.css';
// // // import config from '../config';
// // // import usePhaser from '../hooks/usePhaser';
// import Game from '../src/index';

// export default function GameContainer() {
//   const gameContainer = useRef('gameContainer');
//   const [isFullscreen, { toggleFullscreen }] = useFullscreen(gameContainer);
//   return (
//     <div className={styles.game}>
//       <div
//         className={styles.gameContainer}
//         ref={gameContainer}
//         id="gameContainer"
//       >
//         <Game />
//         <footer>
//           <button
//             className={styles.fullscreenButton}
//             onClick={() => toggleFullscreen()}
//           >
//             {isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
//           </button>
//         </footer>
//       </div>
//     </div>
//   );
// }
