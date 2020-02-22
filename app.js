const Express = require('express')();
const Http = require("http").Server(Express);
const Socketio = require("socket.io")(Http);

Http.listen(3000, () => {
  console.log("port 3000")
});

var point = 5

var board = [
  [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [ 1, 0, 1, 0, 0, 0, 0, 0, 1, 0],
  [ 0, 0, 0, 0, 1, 1, 1, 0, 1, 0],
  [ 0, 1, 1, 0, 0, 0, 1, 0, 1, 0],
  [ 0, 0, 1, 1, 1, 1, 1, 0, 1, 0],
  [ 1, 0, 1, 0, 0, 0, 1, 0, 1, 0],
  [ 1, 0, 1, 0, 1, 0, 1, 0, 0, 0],
  [ 1, 0, 1, 0, 1, 0, 0, 1, 1, 0],
  [-1, 0, 1, 0, 1, 1, 0, 0, 0, 0]
];

var players = {}

Socketio.on("connection", socket => {

  socket.on("new player", () => {
    players[socket.id] = {
      x: 400,
      y: 200
    }
    Socketio.emit('maze', point)
  })

  

  socket.on("disconnect", () => {
    delete (players[socket.id])
  })

  socket.on("move", data => {
    var player = players[socket.id] || {}
    switch (data) {
      case "left":
        if (!findElementByX(player.x - 20, player.y, socket.id)) {
          player.x -= 5;
        } else player.x += 10;
        break;
      case "right":
        if (!findElementByX(player.x + 20, player.y, socket.id)) {
          player.x += 5;
        } else player.x -= 10;
        break;
      case "up":
        if (!findElementByY(player.y - 20, player.x, socket.id)) {
          player.y -= 5;
        } else player.y += 10;
        break;
      case "down":
        if (!findElementByY(player.y + 20, player.x, socket.id)) {
          player.y += 5;
        } else player.y -= 10;
        // position.y = position.y + 5;
        // Socketio.emit("position", { pos: players[socket.id], direction: "down" })
        break;
    }
  });
})

setInterval(() => {
  Socketio.emit('state', players)
}, 1000 / 60)



function findElementByX(coordinateX, coordinateY, id) {
  for (var num in players) {
    var player = players[num];
    if (player.id != id && player.x == coordinateX) {
      if ((player.y >= coordinateY && player.y < coordinateY + 20) || (player.y <= coordinateY && player.y > coordinateY - 20)) {
        return true
      }
    }
  }
  return false
}

function findElementByY(coordinateY, coordinateX, id) {
  for (var num in players) {
    var player = players[num];
    if (player.id != id && player.y == coordinateY) {
      if ((player.x >= coordinateX && player.x < coordinateX + 20) || (player.x <= coordinateX && player.x > coordinateX - 20)) {
        return true
      }
    }
  }
  return false
}