"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameList = exports.Game = void 0;
class Game {
    constructor(name) {
        this.name = name;
    }
}
exports.Game = Game;
class GameList {
    constructor() {
        this.games = {};
        this.total = 0;
    }
    createGame(game) {
    }
    deleteGame(game) {
    }
    addPlayerToGame(game, player) {
    }
    removePlayerFromGame(game, player) {
    }
}
exports.GameList = GameList;
//# sourceMappingURL=Game.js.map