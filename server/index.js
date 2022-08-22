const io = require('socket.io');
const { db } = require('./db');

const PORT = process.env.PORT || 8080;
const app = require('./app');
const seed = require('../seed');
const socketListeners = require('./sockets');
// is this needed:
// require('./socket')(io);

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
      const disconnect = socketListeners(socket);
    });
  } catch (ex) {
    console.log(ex);
  }
};
init();
// start listening (and create a 'server' object representing our server) socket server will go here too
