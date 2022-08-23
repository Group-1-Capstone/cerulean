module.exports = (socket) => {
  socket.on('event', (event) => {
    socket.broadcast.emit('event', event);
  });

  console.log(socket.rooms); // Set { <socket.id> }
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
};
/*
socket.braodcast.emit() to all connected clients except the sender
setlisteners set ids put in rooms
// we need a tear down func return func() on line 5 before close
/** var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendfile('s.html');
});

io.on('connection', function(socket){
    console.log('a user connected: ' + socket.id);
    socket.on('disconnect', function(){
        console.log( socket.name + ' has disconnected from the chat.' + socket.id);
    });
    socket.on('join', function (name) {
        socket.name = name;
        console.log(socket.name + ' joined the chat.');
    });
}); */
/*  game logic file server side functions
when client emits actions send back something to people in that room

rooms can be added here later
first send and get location data and render on front-end. */
//
