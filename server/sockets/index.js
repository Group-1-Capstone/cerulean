module.exports = (socket) => {
  socket.on('event', (event) => {
    socket.broadcast.emit('event', event);
  });
  return ()
};
//setlisteners set ids put in rooms
//we need a tear down func
/*  game logic file server side functions
when client emits actions send back something to people in that room

rooms can be added here later
first send and get location data and render on front-end. */
//
