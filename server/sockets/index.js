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
    //TODO: have to update the server's allPlayers object with the new x and y?
    // maybe something like allPlayers[socket.id] = {...allPlayers[socket.id], data}
    socket.broadcast.emit('playerMoved', { ...data, id: socket.id });
  });
};