"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameList = exports.Game = void 0;
const Player_1 = require("./Player");
const GameBoard_1 = require("./GameBoard");
class Game {
    constructor(name) {
        this.name = name;
        this.size = 0;
        this.players = {};
        this.board = new GameBoard_1.Board();
    }
    addPlayer(player) {
        if (!this.players[player]) {
            this.players[player] = new Player_1.Player(player);
            this.size++;
        }
        return;
    }
    removePlayer(player) {
        if (this.players[player]) {
            delete this.players[player];
            this.size--;
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
            if (this.games[game].size === 0) {
                this.deleteGame(game);
            }
        }
        return;
    }
}
exports.GameList = GameList;
//# sourceMappingURL=Game.js.map