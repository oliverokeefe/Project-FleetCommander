import express from 'express';
import http from 'http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { joinData, gameList } from '../shared/src/types/types.js';
import * as Delta from '../shared/src/classes/GameDelta.js';
import { Server, Socket } from 'socket.io';
import { Game, GameList } from './src/classes/Game.js';
import * as SocketEvents from '../shared/src/classes/SocketEvents.js';
import { GameServer, PlayerSocket } from './src/classes/GameServer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
let httpServer = http.createServer(app);
let io: GameServer = new Server<
    SocketEvents.ClientToServerEvents,
    SocketEvents.ServerToClientEvents,
    SocketEvents.InterServerEvents,
    SocketEvents.SocketData
>(httpServer);

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

function addPlayerToLobby(socket: PlayerSocket, game?: string): void {

    game = (game) ? game : socket.data.game;

    if (!Games.gameExists(game)) {
        createNewGame(game);
    }

    let playerId: string = Games.tryAddPlayerToGame(game);

    if (playerId) {

        socket.data.game = game;
        socket.data.player = playerId;

        sendMessage(socket.data.game, `${socket.data.player} has joined the lobby`);

        socket.join(socket.data.game);
        socket.emit('joinLobby', socket.data.game);
        socket.emit('createPlayer', socket.data.player);
        socket.emit('updateChat', Games.games[socket.data.game].chatLog);

        console.log(`${socket.data.player} has joined the ${socket.data.game} lobby`);

    } else {

        //Add as Spectator
        //Should look the same as above but with a call to Game.addAsSpectator()

        Games.addSpectatorToGame(game);

        socket.data.game = game;
        socket.data.player = GenSpecId;

        socket.join(socket.data.game);
        socket.emit('joinGameAsSpectator', socket.data.game, socket.data.player, Games.games[socket.data.game].board.board);

    }

    return;
}


function createNewGame(game: string): void {

    Games.createGame(game);

    return;
}

function removePlayerFromGame(socket: Socket, game?: string, player?: string): void {

    game = (game) ? game : socket.data.game;
    player = (player) ? player : socket.data.player;

    if (player === GenSpecId) {

        //remove spectator

    } else if (Games.playerInGame(game, player) && socket.data.game && socket.data.player) {
        Games.removePlayerFromGame(game, player);

        sendMessage(socket.data.game, `${socket.data.player} has left the game`)

        socket.leave(socket.data.game);
        socket.data.game = "";
    }

}

function readyUp(socket: Socket, game?: string, playerId?: string): void {

    game = (game) ? game : socket.data.game;
    playerId = (playerId) ? playerId : socket.data.player;

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

function submitPlayerActions(socket: Socket, data: Delta.FromClientDelta, game?: string, playerId?: string): void {

    game = (game) ? game : socket.data.game;
    playerId = (playerId) ? playerId : socket.data.player;

    console.log(`${playerId} submited data`);
    if(Games.gameExists(game)){
        Games.games[game].submitPlayerActions(playerId, data);
        if(Games.games[game].allPlayerActionsSubmitted()) {
            io.to(game).emit('update', Games.games[game].update());
        }
    }

    return;
}

///++++++++++++++++++++++++++++++++++++++++++++++++++




io.on('connection', (socket: PlayerSocket) => {
    console.log('a user connected');

    ///Game init config on socket
    ///++++++++++++++++++++++++++++++++++++++++++++++++++
    socket.data.player = "";
    socket.data.game = "";
    ///++++++++++++++++++++++++++++++++++++++++++++++++++

    socket.on('joinLobby', (game: string) => {
        if (game) {
            addPlayerToLobby(socket, game);
        }
    });

    socket.on('chat', (message: string) => {
        if (socket.data.game) {
            sendMessage(socket.data.game, `${socket.data.player}-${message}`);
        }
        else {
            socket.emit('chat', message);
        }
    });

    socket.on('ready', () => {
        readyUp(socket);
    });

    socket.on('submitActions', (data: Delta.FromClientDelta) => {
        submitPlayerActions(socket, data);
    });

    socket.on('leaveGame', () => {
        removePlayerFromGame(socket);
    });


    socket.on('disconnect', () => {
        if (socket.data.game) {
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

// app.set('port', process.env.PORT || 3000);
app.set('port', 3000);

const server = httpServer.listen(app.get('port'), function () {
    // console.log("Server listeneing on port" + server.address().port);
    console.log("Server listeneing on port 3000");
});
