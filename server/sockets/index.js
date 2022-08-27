module.exports = (socket, allPlayers) => {

  socket.on('event', (event) => {
    socket.broadcast.emit('event', event);
  });

  function getAllPlayers() {
    return allPlayers;
  }
  socket.on('newPlayer', (data) => {
    
    socket.emit('allPlayers', getAllPlayers());
    allPlayers[socket.id] = data

    socket.broadcast.emit('playerJoined', { ...data, id: socket.id });
  });

  socket.on('disconnect', (data) => {
    socket.broadcast.emit('removePlayer', { ...data, id: socket.id });
    delete allPlayers[socket.id]
  });

  socket.on('playerMovement', (data) => {
    allPlayers[socket.id] = {...allPlayers[socket.id], x: data.x, y: data.y}
    socket.broadcast.emit('playerMoved', { ...data, id: socket.id });
  });
};