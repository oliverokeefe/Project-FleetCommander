import debug = require('debug');
import express = require('express');
import path = require('path');

import { joinData, gameList } from '../shared/src/types/types';
import { Server } from 'socket.io';
import { Game, GameList } from './src/classes/Game';

const app = express();
let http = require('http').createServer(app);
let io: SocketIO.Server = require('socket.io')(http);

//app.use((req, res, next) => {
//    console.log(req.url);
//    next();
//});

app.get('/', (req: express.Request, res: express.Response) => {
    res.sendFile(path.join(__dirname, '../client/public/views', 'index.html'));
});

app.use(express.static(path.join(__dirname, '../client/public')));

///Game Sessions Data
///++++++++++++++++++++++++++++++++++++++++++++++++++

let Games: GameList = new GameList();

/**
 * General spectator ID
 */
let GenSpecId: string = "Spectator";

//let testBoard: Board = new Board();
//console.log(testBoard.toString());

///++++++++++++++++++++++++++++++++++++++++++++++++++

///Helpful functions for creating/joining or leaving/deleting a game.
///as well as creating/updating or removing a character.
///++++++++++++++++++++++++++++++++++++++++++++++++++

function sendMessage(game: string, message: string) {
    if (Games.gameExists(game)) {
        Games.games[game].chatLog.push(message);
        io.to(game).emit('chat', message);
    }
    return;
}

function isValidJoinData(joinData: joinData): boolean {
    if (joinData.game && joinData.player) {
        return true;
    }
    else {
        return false;
    }
}

function addPlayerToGame(socket: SocketIO.Socket, game?: string, playerId?: string): boolean {

    game = (game) ? game : socket.game;
    playerId = (playerId) ? playerId : socket.player;

    if (!Games.gameExists(game)) {
        createNewGame(game);
    }

    if (playerId === GenSpecId) {

        Games.addSpectatorToGame(game);

        socket.game = game;
        socket.player = playerId;

        socket.join(socket.game);
        socket.emit('joinGameAsSpectator', socket.game, socket.player, Games.games[socket.game].board.board);

    } else if (!Games.playerInGame(game, playerId)) {

        Games.addPlayerToGame(game, playerId);

        socket.game = game;
        socket.player = playerId;

        sendMessage(socket.game, `${socket.player} has joined the game`);

        socket.join(socket.game);
        socket.emit('joinGame', socket.game, socket.player, Games.games[socket.game].chatLog, Games.games[socket.game].board.board);
    }

    return;
}

function addPlayerToLobby(socket: SocketIO.Socket, game?: string): void {

    game = (game) ? game : socket.game;

    if (!Games.gameExists(game)) {
        createNewGame(game);
    }

    let playerId: string = Games.tryAddPlayerToGame(game);

    console.log(`Join ${game} lobby attempt by ${playerId}`)

    if (playerId) {

        socket.game = game;
        socket.player = playerId;

        sendMessage(socket.game, `${socket.player} has joined the lobby`);

        socket.join(socket.game);
        socket.emit('joinLobby', socket.game);
        socket.emit('updateChat', Games.games[socket.game].chatLog);

        console.log(`${socket.player} has joined the ${socket.game} lobby`);

    } else {

        //Add as Spectator
        //Should look the same as above but with a call to Game.addAsSpectator()

        Games.addSpectatorToGame(game);

        socket.game = game;
        socket.player = GenSpecId;

        socket.join(socket.game);
        socket.emit('joinGameAsSpectator', socket.game, socket.player, Games.games[socket.game].board.board);

    }

    return;
}


function createNewGame(game: string): void {

    Games.createGame(game);

    return;
}

function removePlayerFromGame(socket: SocketIO.Socket, game?: string, player?: string): void {

    game = (game) ? game : socket.game;
    player = (player) ? player : socket.player;

    if (player === GenSpecId) {

        //remove spectator

    } else if (Games.playerInGame(game, player) && socket.game && socket.player) {
        Games.removePlayerFromGame(game, player);

        sendMessage(socket.game, `${socket.player} has left the game`)

        socket.leave(socket.game);
        socket.game = "";
    }

}

function readyUp(game: string, playerId: string): void {
    if (Games.gameExists(game)) {
        Games.readyPlayerInGame(game, playerId);
        sendMessage(game, `${playerId} Ready!`);
        console.log(`${playerId} Ready!`);

        //Then check if all players have ready-d
        if (Games.games[game].allPlayersReady()) {
            console.log(`${game} START!!!`);
            sendMessage(game, `### START ###`);
        }
            //if so, linku staut
    }
    return;
}

function startGame(game: string): void {

    if (Games.gameExists(game)) {
        Games.startGame(game);
        io.to(game).emit('start');
    }

    return;
}

///++++++++++++++++++++++++++++++++++++++++++++++++++




io.on('connection', (socket: SocketIO.Socket) => {
    console.log('a user connected');

    ///Game init config on socket
    ///++++++++++++++++++++++++++++++++++++++++++++++++++
    socket.player = "";
    socket.game = "";
    ///++++++++++++++++++++++++++++++++++++++++++++++++++

    socket.on('joinLobby', (game: string) => {
        if (game) {
            console.log(`Attempt to join ${game} lobby`);
            addPlayerToLobby(socket, game);
        }
    });

    socket.on('joinGame', (joinData: joinData) => {
        if (isValidJoinData(joinData)) {
            addPlayerToGame(socket, joinData.game, joinData.player);
        }
    });

    socket.on('chat', (message: string) => {
        if (socket.game) {
            sendMessage(socket.game, `${socket.player}-${message}`);
        }
        else {
            socket.emit('chat', message);
        }
    });

    socket.on('ready', () => {
        readyUp(socket.game, socket.player);
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
