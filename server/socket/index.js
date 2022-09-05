const allPlayers = {};
function getAllPlayers() {
  return allPlayers;
}
module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(
      `a socket connection to the server has been made: ${socket.id}`
    );

    socket.on('newPlayer', (data) => {
      socket.emit('allPlayers', getAllPlayers());
      allPlayers[socket.id] = data;

      socket.broadcast.emit('playerJoined', { ...data, id: socket.id });
    });

    socket.on('messageSent', (message) => {
      console.log('server received', message, 'by', socket.id);

      socket.broadcast.emit('messageSent', { message, id: socket.id });
    });

    socket.on('disconnect', (data) => {
      socket.broadcast.emit('removePlayer', { ...data, id: socket.id });
      delete allPlayers[socket.id];
    });

    socket.on('playerMovement', (data) => {
      allPlayers[socket.id] = {
        ...allPlayers[socket.id],
        x: data.x,
        y: data.y,
      };
      socket.broadcast.emit('playerMoved', { ...data, id: socket.id });
    });
  });
};
