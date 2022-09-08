const io = require('socket.io');
const { db } = require('./db');

const PORT = process.env.PORT || 8080;
const app = require('./app');
const seed = require('../seed');
const socketListeners = require('./sockets');
const allPlayers = {};
const init = async () => {
  try {
    if (process.env.SEED === 'true') {
      await seed();
    } else {
      await db.sync();
    }
    const server = app.listen(PORT, () =>
      console.log(`Mixing it up on port ${PORT}`)
    );
    const socketServer = new io.Server(server);
    socketServer.on('connection', (socket) => {
      socketListeners(socket, allPlayers);
      console.log(`Connection from player ${socket.id}`);
    });
  } catch (ex) {
    console.log(ex);
  }
};
init();
