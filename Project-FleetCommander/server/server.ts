import debug = require('debug');
import express = require('express');
import path = require('path');

import { joinData, gameList } from '../shared/src/types/types';
import * as Delta from '../shared/src/classes/GameDelta';
import { Server } from 'socket.io';
import { Game, GameList } from './src/classes/Game';
import { PlayerSocket } from './src/classes/PlayerSocket';
import { read } from 'fs';

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
let PlayerSockets: Map<string, PlayerSocket> = new Map<string, PlayerSocket>();

let spectatorId: string = "Spectator";

//let testBoard: Board = new Board();
//console.log(testBoard.toString());

///++++++++++++++++++++++++++++++++++++++++++++++++++

///Helpful functions for creating/joining or leaving/deleting a game.
///as well as creating/updating or removing a character.
///++++++++++++++++++++++++++++++++++++++++++++++++++

function sendMessage(game: string, message: string) {

    if (!game || !message) {
        console.error("missing args: sendMessage");
    }

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

function addPlayerToLobby(socket: SocketIO.Socket, game: string): string {

    if (!socket || !game) {
        console.error("missing args: addPlayerToLobby");
    }

    if (!Games.gameExists(game)) {
        createNewGame(game);
    }

    let player: string = Games.tryAddPlayerToGame(game);

    if (player) {

        sendMessage(game, `${player} has joined the lobby`);

        socket.join(game);
        socket.emit('joinLobby', game);
        socket.emit('createPlayer', player);
        socket.emit('updateChat', Games.games[game].chatLog);

        console.log(`${player} has joined the ${game} lobby`);
    } else {
        //Add as Spectator
        //Should look the same as above but with a call to Game.addAsSpectator()
        player = spectatorId;
        Games.addSpectatorToGame(game);
        socket.join(game);
        socket.emit('joinGameAsSpectator', game, player, Games.games[game].board.board);

    }

    return player;
}


function createNewGame(game: string): void {

    Games.createGame(game);

    return;
}

function removePlayerFromGame(socket: SocketIO.Socket, game: string, player: string): void {

    if (!socket || !game || !player) {
        console.error("missing args: removePlayerFromGame");
    }

    if (player === spectatorId) {

        //remove spectator

    } else if (Games.playerInGame(game, player) && game && player) {
        Games.removePlayerFromGame(game, player);

        sendMessage(game, `${player} has left the game`)

        socket.leave(game);
    }

    //Also remove PlayerSocket from list

}

function readyUp(socket: SocketIO.Socket, game: string, playerId: string): void {

    if (!socket || !game || !playerId) {
        console.error("missing args: readyUp");
    }

    if (Games.gameExists(game)) {
        Games.readyPlayerInGame(game, playerId);
        sendMessage(game, `${playerId} Ready!`);
        console.log(`${playerId} Ready!`);

        //Then check if all players have ready-d
        if (Games.games[game].allPlayersReady()) {
            sendMessage(game, `### START ###`);
            startGame(game);
        }
    }
    return;
}

function startGame(game: string): void {

    if (Games.gameExists(game)) {
        let startGameData: Delta.InitialGameState = Games.startGame(game);
        io.to(game).emit('start', startGameData);
    }

    return;
}

function submitPlayerActions(socket: SocketIO.Socket, data: Delta.FromClientDelta, game: string, playerId: string): void {

    if (!socket || !game || !playerId) {
        console.error("missing args: submitPlayerActions");
    }

    console.log(`${playerId} submited data`);
    if(Games.gameExists(game)){
        Games.games[game].submitPlayerActions(playerId, data);
        if(Games.games[game].allPlayerActionsSubmitted()) {
            io.to(game).emit('update', Games.games[game].update());
        }
    }

    return;
}

function cleanup(socket: SocketIO.Socket): void {

    PlayerSockets.delete(socket.id);

    return;
}

///++++++++++++++++++++++++++++++++++++++++++++++++++




io.on('connection', (socket: SocketIO.Socket) => {
    console.log('a user connected');

    let playerSocket = new PlayerSocket(
        socket,
        addPlayerToLobby,
        sendMessage,
        readyUp,
        submitPlayerActions,
        removePlayerFromGame,
        cleanup
    );

    //Add object to some list and remove it on disconnects
    PlayerSockets.set(socket.id, playerSocket);
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
