"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debug = require("debug");
const express = require("express");
const path = require("path");
const app = express();
let http = require('http').createServer(app);
let io = require('socket.io')(http);
//app.use((req, res, next) => {
//    console.log(req.url);
//    next();
//});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/public/views', 'index.html'));
});
app.use(express.static(path.join(__dirname, '../client/public')));
///Game Sessions Data
///++++++++++++++++++++++++++++++++++++++++++++++++++
let GameList = {};
///++++++++++++++++++++++++++++++++++++++++++++++++++
///Helpful functions for creating/joining or leaving/deleting a game.
///as well as creating/updating or removing a character.
///++++++++++++++++++++++++++++++++++++++++++++++++++
function sendMessage(game, message) {
    if (gameExists(game)) {
        GameList[game].chatLog.push(message);
        io.to(game).emit('chat', message);
    }
    return;
}
function isValidJoinData(joinData) {
    if (joinData.game && joinData.player) {
        return true;
    }
    else {
        return false;
    }
}
function addPlayerToGame(socket, game, player) {
    game = (game) ? game : socket.game;
    player = (player) ? player : socket.player;
    if (!gameExists(game)) {
        createNewGame(game);
    }
    if (!playerInGame(game, player)) {
        GameList[game].playerList[player] = player;
        GameList[game].playerCount++;
        //Later player will be class so this would use a constructor
        socket.game = game;
        socket.player = player;
        sendMessage(socket.game, `${socket.player} has joined the game`);
        socket.join(socket.game);
        socket.emit('joinGame', GameList[socket.game], socket.player);
    }
    return;
}
function createNewGame(game) {
    GameList[game] = {
        name: game,
        chatLog: [],
        playerList: {},
        playerCount: 0
    };
    //later Game should be a class and this would just
    //be a constructor call..but for now...here
}
function removePlayerFromGame(socket, game, player) {
    game = (game) ? game : socket.game;
    player = (player) ? player : socket.player;
    if (playerInGame(game, player) && socket.game && socket.player) {
        delete GameList[game].playerList[player];
        GameList[game].playerCount--;
        deleteGameIfEmpty(game);
        sendMessage(socket.game, `${socket.player} has left the game`);
        socket.leave(socket.game);
        socket.game = "";
    }
}
function deleteGameIfEmpty(game) {
    if (GameList[game] && GameList[game].playerCount < 1) {
        delete GameList[game];
    }
}
function gameExists(game) {
    return (GameList[game]) ? true : false;
}
function playerInGame(game, player) {
    return (GameList[game] && GameList[game].playerList[player]) ? true : false;
}
///++++++++++++++++++++++++++++++++++++++++++++++++++
io.on('connection', (socket) => {
    console.log('a user connected');
    ///Game init config on socket
    ///++++++++++++++++++++++++++++++++++++++++++++++++++
    socket.player = "";
    socket.game = "";
    ///++++++++++++++++++++++++++++++++++++++++++++++++++
    socket.on('joinGame', (joinData) => {
        if (isValidJoinData(joinData)) {
            addPlayerToGame(socket, joinData.game, joinData.player);
        }
    });
    socket.on('chat', (message) => {
        if (socket.game) {
            sendMessage(socket.game, `${socket.player}-${message}`);
        }
        else {
            socket.emit('chat', message);
        }
    });
    socket.on('leaveGame', () => {
        removePlayerFromGame(socket);
    });
    socket.on('disconnect', () => {
        if (socket.game) {
            removePlayerFromGame(socket);
        }
        console.log('user disconnected');
    });
});
// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err['status'] = 404;
    next(err);
});
if (app.get('env') === 'development') {
    app.use((err, req, res, next) => {
        res.status(err['status'] || 500);
        res.send("respond with a BLANK resource");
    });
}
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send("respond with a BLANK resource");
});
app.set('port', process.env.PORT || 3000);
const server = http.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
    console.log("Server listeneing on port" + server.address().port);
});
//# sourceMappingURL=server.js.map