"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameList = exports.Game = void 0;
const Player_1 = require("./Player");
const GameBoard_1 = require("../../../shared/src/classes/GameBoard");
class Game {
    constructor(name) {
        this.name = name;
        this.playerCount = 0;
        this.players = {};
        this.board = new GameBoard_1.Board();
    }
    addPlayer(player) {
        if (!this.players[player]) {
            this.players[player] = new Player_1.Player(player);
            this.playerCount++;
            this.board.territories.forEach((territory) => {
                if (!territory.player && !this.players[player].territory) {
                    territory.player = this.players[player].name;
                    this.players[player].territory = territory;
                }
            });
        }
        return;
    }
    removePlayer(player) {
        if (this.players[player]) {
            this.board.territories.forEach((territory) => {
                if (territory.player === this.players[player].name) {
                    territory.player = "";
                    this.players[player].territory = undefined;
                }
            });
            delete this.players[player];
            this.playerCount--;
        }
        return;
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
    addPlayerToGame(game, player) {
        if (this.games[game]) {
            this.games[game].addPlayer(player);
        }
        return;
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