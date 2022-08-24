export default function SocketCommands(Game) {
  const Client = {};
  Client.socket = io.connect();


  Client.socket.on('connect', () => {
    console.log('Socket connected to server');
  }); 

//   Client.sendTest = function(){
//       console.log("test sent");
//       Client.socket.emit('test');
//   };

//   Client.askNewPlayer = function(){
//       Client.socket.emit('newplayer');
//   };

//   Client.sendClick = function(x,y){
//     Client.socket.emit('click',{x:x,y:y});
//   };
  // send location instead of click / validation of where can travel to

  // per Drew: taps and clicks are very similar,
  // make methods using mouse clicks - easy to adapt for mobile use
  // on-screen buttons are harder to program

  Client.socket.on('newplayer',function(data){
      Game.addNewPlayer(data.id,data.x,data.y);
      console.log('new player added')
  });

  Client.socket.on('allplayers',function(data){
      for(var i = 0; i < data.length; i++){
          Game.addNewPlayer(data[i].id,data[i].x,data[i].y);
      }

      Client.socket.on('move',function(data){
          Game.movePlayer(data.id,data.x,data.y);
      });

      Client.socket.on('remove',function(id){
          Game.removePlayer(id);
      });
  });
}

