const Express = require('express')();
const Http = require("http").Server(Express);
const Socketio = require("socket.io")(Http);

Http.listen(3000, () => {
    console.log("port 3000")
});

// Http.use(Express.static('public'))
// Http.use('/images', express.static(__dirname + '/Images'));


var colors = [
    '#7FFF00', '#0000FF', '#8A2BE2'
]

var board = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 2],
    [1, 0, 1, 1, 1, 1, 0, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 1, 0, 1, 0, 1, 0, 1, 1],
    [1, 0, 0, 0, 1, 1, 1, 0, 1, 1],
    [1, 0, 1, 0, 0, 0, 1, 0, 1, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

var board2 = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 1, 1, 0, 0, 1, 1, 1, 1],
    [1, 0, 1, 0, 0, 1, 1, 0, 0, 2],
    [1, 0, 0, 0, 1, 1, 0, 0, 1, 1],
    [1, 0, 1, 1, 1, 0, 0, 1, 1, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

var board3 = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 0, 1, 0, 1, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 0, 0, 1, 0, 1, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 2, 1]
];

var board4 = [
    [1, 1, 1, 1, 1, 1, 1, 2, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 1, 0, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 0, 1, 0, 0, 0, 1, 0, 1, 1],
    [1, 0, 1, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

var board5 = [
    [1, 1, 1, 1, 1, 2, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];


var boardsArray = [board, board2, board3, board4, board5]

var width = 640
var blockSize = width / board.length;
var colorID = 0

var players = {}

var rooms = [
    { id: 0, name: 'Классика', image: "" },
    { id: 1, name: 'Ступеньки', image: "" },
    { id: 2, name: 'Стены', image: "" },
    { id: 3, name: 'Сетка', image: "" },
    { id: 4, name: 'Привет!', image: "" },
];

Socketio.on("connection", socket => {

    socket.on('checkRooms', () => {
        socket.emit('rooms', rooms)
    })

    socket.on("new player", (roomId) => {
        players[socket.id] = {
            x: 70,
            y: 70,
            color: colors[Math.floor(Math.random() * Math.floor(3))],
            time: 1,
            playerRoomId: roomId
        }
        if (colorID < colors.length - 1) {
            colorID++;
        }
        socket.join(rooms[roomId].name)
        Socketio.in(rooms[roomId].name).emit('maze', boardsArray[roomId])
    })

    socket.on("disconnectUser", () => {
        delete (players[socket.id])
    })

    socket.on("disconnect", () => {
        delete (players[socket.id])
    })

    socket.on("move", data => {
        var player = players[socket.id] || {}
        var id = player.playerRoomId
        switch (data) {
            case "left":
                Socketio.in(rooms[id].name).emit('maze', boardsArray[id])
                if (ifWin(player.x - 5, player.y)) {
                    console.log(socket.id)
                    delete (players[socket.id])
                    Socketio.to(socket.id).emit('win', socket.id)
                }
                else if (!findElementByX(player.x - 20, player.y, socket.id, id) && canMoveThrough(player.x - 5, player.y, id)) {
                    player.x -= 5
                } else {
                    player.x += 10;
                }
                roomPlayers = Object.values(players).filter(item => {
                    return item.playerRoomId == id
                })
                Socketio.in(rooms[id].name).emit('state', roomPlayers)
                // Socketio.emit('state', players)     
                break;
            case "right":
                // Socketio.emit('maze', board)
                Socketio.in(rooms[id].name).emit('maze', boardsArray[id])
                if (ifWin(player.x + 25, player.y)) {
                    console.log(socket.id)
                    delete (players[socket.id])
                    Socketio.to(socket.id).emit('win', socket.id)
                } else if (!findElementByX(player.x + 20, player.y, socket.id, id) && canMoveThrough(player.x + 25, player.y, id)) {
                    player.x += 5
                } else player.x -= 10;
                // Socketio.emit('state', players)
                roomPlayers = Object.values(players).filter(item => {
                    return item.playerRoomId == id
                })
                Socketio.in(rooms[id].name).emit('state', roomPlayers)
                break;
            case "up":
                // Socketio.emit('maze', board)
                Socketio.in(rooms[id].name).emit('maze', boardsArray[id])
                if (ifWin(player.x, player.y - 5)) {
                    console.log(socket.id)
                    delete (players[socket.id])
                    Socketio.to(socket.id).emit('win', socket.id)
                }
                else if (!findElementByY(player.y - 20, player.x, socket.id, id) && canMoveThrough(player.x, player.y - 5, id)) {
                    player.y -= 5;
                } else player.y += 10;
                // Socketio.emit('state', players)
                roomPlayers = Object.values(players).filter(item => {
                    return item.playerRoomId == id
                })
                Socketio.in(rooms[id].name).emit('state', roomPlayers)
                break;
            case "down":
                // Socketio.emit('maze', board)
                Socketio.in(rooms[id].name).emit('maze', boardsArray[id])
                if (ifWin(player.x, player.y + 25)) {
                    console.log(socket.id)
                    delete (players[socket.id])
                    Socketio.to(socket.id).emit('win', socket.id)
                }
                if (!findElementByY(player.y + 20, player.x, socket.id, id) && canMoveThrough(player.x, player.y + 25, id)) {
                    player.y += 5;
                } else player.y -= 10;
                // Socketio.emit('state', players)
                roomPlayers = Object.values(players).filter(item => {
                    return item.playerRoomId == id
                })
                Socketio.in(rooms[id].name).emit('state', roomPlayers)
                break;
        }
    });
})



setInterval(() => {
    currPlayers = Object.values(players)
    rooms.forEach(room => {
        roomPlayers = currPlayers.filter(item => {
            return item.playerRoomId == room.id
        })
        Socketio.in(room.name).emit('state', roomPlayers)
    })
    // Socketio.emit('state', players)
}, 1000 / 60)




function sendOldPosition(position) {
    Socketio.emit('old', position)
}


function findElementByX(coordinateX, coordinateY, id, roomId) {
    roomPlayers = Object.values(players).filter(item => {
        return item.playerRoomId == roomId
    })
    for (var num in roomPlayers) {
        var player = roomPlayers[num];
        if (player.id != id && player.x == coordinateX) {
            if ((player.y >= coordinateY && player.y < coordinateY + 20) || (player.y <= coordinateY && player.y > coordinateY - 20)) {
                return true
            }
        }
    }
    return false
}

function findElementByY(coordinateY, coordinateX, id, roomId) {
    roomPlayers = Object.values(players).filter(item => {
        return item.playerRoomId == roomId
    })
    for (var num in roomPlayers) {
        var player = roomPlayers[num];
        if (player.id != id && player.y == coordinateY) {
            if ((player.x >= coordinateX && player.x < coordinateX + 20) || (player.x <= coordinateX && player.x > coordinateX - 20)) {
                return true
            }
        }
    }
    return false
}

function ifWin(x, y) {
    if (x == 0 || y == 0 || x == width || y == width) {
        return true
    }
    return false
}

function canMoveThrough(coordinateX, coordinateY, roomId) {
    var currentBoard = boardsArray[roomId]
    return (currentBoard[Math.trunc(coordinateY / blockSize)][Math.trunc(coordinateX / blockSize)] == 0
        || currentBoard[Math.trunc(coordinateY / blockSize)][Math.trunc(coordinateX / blockSize)] == 2)
    // return (board[Math.trunc(coordinateY / blockSize)][Math.trunc(coordinateX / blockSize)] == 0)
}