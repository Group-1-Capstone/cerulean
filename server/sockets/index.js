module.exports = (socket) => {
  let rooms = {};

  socket.on('event', (event) => {
    socket.broadcast.emit('event', event);
  });

  // testing to see this in the browser:
  socket.broadcast.emit('newPlayer', { id: 10, x: 300, y: 400 });

  socket.on('join room', (roomName, name) => {
    socket.room = roomName;
    socket.name = name;

    if (!rooms.hasOwnProperty(roomName)) {
      rooms[roomName] = {
        players: {},
      };
    }

    // create new player and add to players obj
    rooms[roomName].players[socket.id] = {
      name,
      x: Math.floor(Math.random() * 700) + 50,
      y: Math.floor(Math.random() * 500 + 50),
      playerId: socket.id,
      room: roomName,
    };

    // update other players of new player
    socket.broadcase.emit(
      'newPlayer',
      rooms[roomName].players[socket.id],
      roomName
    );

    // tell others in room that someone just joined
    setTimeout(() => {
      console.log(socket.id);
      socket.to(roomName).emit('send id', socket.id, rooms[roomName].user);
    }, 500);

    // socket now connected to specific roomName
    socket.join(roomName).emit('success', roomName);

    // update player data when player moves, not sure if we need:
    // socket.on('playerMovement', function(movementData) {
    //   rooms[roomName].players[socket.id].x = movementData.x
    //   rooms[roomName].players[socket.id].y = movementData.y
    // })

    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left`);

      //if socket left after joining a room, meaning refreshed page
      if (rooms[socket.room]) {
        //if socket had a name attached to it
        if (socket.name) {
          // remove this player from our players object
          delete rooms[roomName].players[socket.id];
          // emit a message to all players to remove this player
          io.emit('disconnect', socket.id);

          console.log('user disconnected');

          // if (rooms[socket.room].players === {}) {
          //   delete rooms[socket.room]
          // }
        }
      }
    });
  });
};
// setlisteners set ids put in rooms
// we need a tear down func return func() on line 5 before close
/*  game logic file server side functions
when client emits actions send back something to people in that room

rooms can be added here later
first send and get location data and render on front-end. */
//
