const socketio = require('socket.io');
const PORT = process.env.PORT || 8080;
const app = require('./app');

const init = async () => {
  try {
    //start listening and create a 'server' object representing our server.
    const server = app.listen(PORT, () =>
      console.log(`Mixing it up on port ${PORT}`)
    );
    //no socket has been initialized in our game yet here, it will be initialized in scene.  We are plugging in our socketio variable and passing it to our socket folder.
    const io = socketio(server);
    require('./socket')(io);
  } catch (ex) {
    console.log(ex);
  }
};
init();
// start listening (and create a 'server' object representing our server)
