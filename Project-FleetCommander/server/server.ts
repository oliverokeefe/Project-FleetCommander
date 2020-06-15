import debug = require('debug');
import express = require('express');
import path = require('path');

import { stats } from '../shared/src/types/types';
import { Player } from '../shared/src/classes/Player';

const app = express();
let http = require('http').createServer(app);
let io = require('socket.io')(http);

//app.use((req, res, next) => {
//    console.log(req.url);
//    next();
//});

app.get('/', (req: express.Request, res: express.Response) => {
    res.sendFile(path.join(__dirname, '../client/public/views', 'index.html'));
});

app.use(express.static(path.join(__dirname, '../client/public')));

let games = { sessions: 0 };


///Helpful functions for creating/joining or leaving/deleting a game.
///as well as creating/updating or removing a character.
///++++++++++++++++++++++++++++++++++++++++++++++++++
function createGame(game: string): string {
    games[game] = { playerTotal: 0 };
    return game;
}

function addPlayer(game: string, playerName: string): string {
    if (games[game]) {
        games[game][playerName] = playerName;
        games[game].playerTotal++;
        return playerName;
    }
    return "";
}

function removePlayer(game: string, playerName: string): string {
    if (games[game] && games[game][playerName]) {
        delete games[game][playerName];
        games[game].playerTotal--;
        deleteGameIfEmpty(game);
        return "";
    }
    return game;
}

function replacePlayer(game: string, oldPlayerName: string, newPlayerName: string): string {
    if (games[game] && games[game][oldPlayerName]) {
        delete games[game][oldPlayerName];
        games[game][newPlayerName] = newPlayerName;
        return newPlayerName;
    }
    return "";
}

function deleteGameIfEmpty(game: string): void {
    if (games[game] && games[game].playerTotal === 0) {
        delete games[game];
    }
    return;
}
///++++++++++++++++++++++++++++++++++++++++++++++++++


io.on('connection', (socket) => {
    console.log('a user connected');

    ///Game init config on socket
    ///++++++++++++++++++++++++++++++++++++++++++++++++++
    socket.game = "";
    socket.playerName = "";
    ///++++++++++++++++++++++++++++++++++++++++++++++++++

    socket.createPlayer = function (playerName: string): void {
        if (socket.game) {
            if (socket.playerName) {
                socket.playerName = replacePlayer(socket.game, socket.playerName, playerName);
            } else {
                socket.playerName = addPlayer(socket.game, playerName);
            }
        }
    }

    socket.joinGame = function (game: string): void {

        socket.leaveGame();

        socket.join(game);
        socket.game = game;
        if (socket.playerName) {
            addPlayer(socket.game, socket.playerName);
        }

    }

    socket.leaveGame = function(): void {
        if (socket.game) {
            socket.leave(socket.game);
            if (socket.playerName) {
                socket.game = removePlayer(socket.game, socket.playerName);
            } else {
                socket.game = "";
            }
        }
    }



    socket.on('EnterBtnClicked', (msg) => {
        console.log('message: ' + msg);
        io.emit('Output', msg + "</br></br>This Came From Server!");
    });

    socket.on('joinGame', (game) => {

        //Delete the game if leaving and was last player
        socket.leaveGame();


        //Save new game data to player and create game if new game
        socket.game = game;
        if (!games[socket.game]) {
            games[socket.game] = {};
        };

        //socket.emit('message', {
        //    msg: "Here",
        //    game: games
        //});
        //socket.broadcast.to(game).emit('message', { msg: "There" });

        let stats: stats = {
            str: 13,
            dex: 13,
            con: 12,
            int: 12,
            wis: 11,
            cha: 11
        };

        let player = new Player("theID", "Player1", stats);

        //io.sockets.in(socket.game).emit('message', "ALL", player);

        console.log('Player Joined Game: ' + game);
        console.log(games);
    });

    socket.on('createPlayer', (player) => {
        if (socket.game && games[socket.game]) {
            delete games[socket.game][socket.playerName];
            games[socket.game][player] = player;
        }
        socket.playerName = player;

        console.log(`${player} Created`);
        console.log(games);
    });

    socket.on('disconnect', () => {
        socket.leaveGame();
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
