const io = require('socket.io');
const { db } = require('./db');

const PORT = process.env.PORT || 8080;
const app = require('./app');
const seed = require('../seed');
const socketListeners = require('./sockets');
/* https://socket.io/docs/v4/client-api/#socketdisconnect */
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
// start listening (and create a 'server' object representing our server)
/* looks like there is already a socket.on 'disconnect' built in function?
 * https://www.tutorialspoint.com/socket.io/socket.io_hello_world.htm
 * https://socket.io/docs/v4/server-api/#socketdisconnectclose */
/* Disconnects this socket. If value of close is true, closes the underlying connection. Otherwise, it just disconnects the namespace.

****
io.on("connection", (socket) => {
  setTimeout(() => socket.disconnect(true), 5000);
});
****OR
//Whenever someone connects this gets executed
io.on('connection', function(socket){
   console.log('A user connected');

   //Whenever someone disconnects this piece of code executed
   socket.on('disconnect', function () {
      console.log('A user disconnected');
   });
}); */
