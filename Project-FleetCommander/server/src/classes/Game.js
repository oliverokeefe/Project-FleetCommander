"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameList = exports.Game = exports.GameDelta = void 0;
const Player_1 = require("./Player");
const GameBoard_1 = require("../../../shared/src/classes/GameBoard");
/**
 * Send to cliet to update game
 *
 */
class GameDelta {
}
exports.GameDelta = GameDelta;
class Game {
    constructor(name) {
        this.name = name;
        this.playerCount = 0;
        //this.players = {};
        this.players = {
            Player1: undefined,
            Player2: undefined,
            Player3: undefined,
            Player4: undefined
        };
        this.chatLog = [];
        this.board = new GameBoard_1.Board();
    }
    start() {
        //start the game
        /*
        Generate game board
            -ships will have their player's ID on them
                -Use this ID to verify all moves
        
        Start pawn phase
            -always verify player moves with the current phase
        
        Send client the phase, game object data delta (a.k.a ship location/status), any other data for rendering
        */
        this.board = new GameBoard_1.Board();
        return;
    }
    update() {
        return;
    }
    addPlayer(id, name) {
        let success = false;
        if (this.players.hasOwnProperty(id) && !this.players[id]) {
            this.players[id] = new Player_1.Player(id, name);
            this.playerCount++;
            this.board.territories.forEach((territory) => {
                if (!territory.player || !this.players[id].territory) {
                    territory.player = this.players[id].id;
                    this.players[id].territory = territory;
                }
            });
            success = true;
        }
        return success;
    }
    tryAddPlayer(playerName) {
        let success = false;
        let firstAvailableId = this.getFirstAvailablePlayerSlot();
        playerName = (playerName) ? playerName : firstAvailableId;
        if (firstAvailableId) {
            success = this.addPlayer(firstAvailableId, playerName);
        }
        return (success) ? firstAvailableId : "";
    }
    /**
     * TODO
     */
    addSpectator() {
        //really just need to increment a counter
        //Spectators have no need for a data model
        return false;
    }
    removePlayer(playerId) {
        let success = false;
        if (this.players[playerId]) {
            this.board.territories.forEach((territory) => {
                if (territory.player === this.players[playerId].id) {
                    territory.player = "";
                    this.players[playerId].territory = undefined;
                }
            });
            this.players[playerId] = undefined;
            this.playerCount--;
            success = true;
        }
        return success;
    }
    /**
     * TODO
     */
    removeSpectator() {
        //just decrement the spectator counter
        return false;
    }
    getFirstAvailablePlayerSlot() {
        let ids = Object.keys(this.players);
        let firstAvailable = undefined;
        ids.forEach((id) => {
            if (!this.players[id]) {
                firstAvailable = (firstAvailable) ? firstAvailable : id;
            }
        });
        return firstAvailable;
    }
    readyPlayer(playerId) {
        this.players[playerId].setReady(true);
        return;
    }
    allPlayersReady() {
        let ids = Object.keys(this.players);
        let allReady = true;
        ids.forEach((id) => {
            if (!this.players[id].ready) {
                allReady = false;
            }
        });
        return allReady;
    }
}
exports.Game = Game;
class GameList {
    constructor() {
        this.games = {};
        this.total = 0;
    }
    createGame(game) {
        if (!this.games[game]) {
            this.games[game] = new Game(game);
            this.total++;
        }
        return;
    }
    deleteGame(game) {
        if (this.games[game]) {
            delete this.games[game];
            this.total--;
        }
        return;
    }
    addPlayerToGame(game, playerId) {
        if (this.games[game]) {
            this.games[game].addPlayer(playerId);
        }
        return;
    }
    readyPlayerInGame(game, playerId) {
        if (this.games[game]) {
            this.games[game].readyPlayer(playerId);
        }
        return;
    }
    tryAddPlayerToGame(game, playerName) {
        let playerId = "";
        if (this.games[game]) {
            playerId = this.games[game].tryAddPlayer(playerName);
        }
        return playerId;
    }
    startGame(game) {
        if (this.games[game]) {
            this.games[game].start();
        }
        return;
    }
    /**
     * TODO
     */
    addSpectatorToGame(game) {
        let success = false;
        if (this.games[game]) {
            success = this.games[game].addSpectator();
        }
        return success;
    }
    removePlayerFromGame(game, player) {
        if (this.games[game]) {
            this.games[game].removePlayer(player);
            if (this.games[game].playerCount === 0) {
                this.deleteGame(game);
            }
        }
        return;
    }
    /**
     * TODO
     */
    removeSpectatorFromGame(game) {
        let success = false;
        if (this.games[game]) {
            success = this.games[game].removeSpectator();
        }
        return success;
    }
    gameExists(game) {
        return (this.games[game]) ? true : false;
    }
    deleteGameIfEmpty(game) {
        if (this.games[game] && this.games[game].playerCount < 1) {
            this.deleteGame(game);
        }
    }
    playerInGame(game, player) {
        return (this.games[game] && this.games[game].players[player]) ? true : false;
    }
}
exports.GameList = GameList;
//# sourceMappingURL=Game.js.map