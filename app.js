const Express = require('express')();
const Http = require("http").Server(Express);
const Socketio = require("socket.io")(Http);

Http.listen(3000, () => {
  console.log("port 3000")
});

var position = {
  x: 400,
  y: 200
};

var players = {}

Socketio.on("connection", socket => {

  socket.on("new player", () => {
    players[socket.id] = {
      x: 400,
      y: 200
    }
  })

  socket.on("move", data => {
    var player = players[socket.id] || {}
    switch (data) {
      case "left":
        player.x -= 5;
        break;
      case "right":
        player.x += 5;
        break;
      case "up":
        player.y -= 5;
        break;
      case "down":
        player.y += 5;
        // position.y = position.y + 5;
        // Socketio.emit("position", { pos: players[socket.id], direction: "down" })
        break;
    }
  });
})

setInterval(() => {
  Socketio.emit('state', players)
}, 1000 / 60)