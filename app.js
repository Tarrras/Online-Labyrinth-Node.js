const Express = require('express')();
const Http = require("http").Server(Express);
const Socketio = require("socket.io")(Http);

Http.listen(3000, () => {
  console.log("port 3000")
});

var colors = [
  '#000000', '#7FFF00', '#0000FF', '#8A2BE2'
]

var board = [
  [1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0],
  [1, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0],
  [1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1],
  [1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0],
  [1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0],
  [1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0]
];
var width = 640
var blockSize = width / board.length;
var colorID = 0

var players = {}

Socketio.on("connection", socket => {

  socket.on("new player", () => {
    players[socket.id] = {
      x: 400,
      y: 200,
      color: colors[colorID]
    }
    if(colorID < colors.length) colorID++ ;
    Socketio.emit('maze', board)
  })

  socket.on("disconnect", () => {
    delete (players[socket.id])
  })

  socket.on("move", data => {
    var player = players[socket.id] || {}
    switch (data) {
      case "left":
        Socketio.emit('maze', board)
        if (!findElementByX(player.x - 20, player.y, socket.id) && canMove(player.x - 5, player.y)) {
          player.x -= 5
        } else {
          player.x += 10;
        }
        Socketio.emit('state', players)
        break;
      case "right":
        Socketio.emit('maze', board)
        if (!findElementByX(player.x + 20, player.y, socket.id) && canMove(player.x + 25, player.y)) {
          player.x += 5
        } else player.x -= 10;
        Socketio.emit('state', players)
        break;
      case "up":
        Socketio.emit('maze', board)
        if (!findElementByY(player.y - 20, player.x, socket.id) && canMove(player.x, player.y - 5)) {
          player.y -= 5;
        } else player.y += 10;
        Socketio.emit('state', players)
        break;
      case "down":
        Socketio.emit('maze', board)
        if (!findElementByY(player.y + 20, player.x, socket.id) && canMove(player.x, player.y + 25)) {
          player.y += 5;
        } else player.y -= 10;
        Socketio.emit('state', players)
        break;
    }
  });
})

setInterval(() => {
  Socketio.emit('state', players)
}, 1000 / 60)


function sendOldPosition(position) {
  Socketio.emit('old', position)
}


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

function canMove(x, y) {
  return (y >= 0) && (y <= width) && (x >= 0) && (x <= width) && canMoveThrough(x, y)
}

function canMoveThrough(coordinateX, coordinateY) {
  return (board[Math.trunc(coordinateY / blockSize)][Math.trunc(coordinateX / blockSize)] == 0)
}