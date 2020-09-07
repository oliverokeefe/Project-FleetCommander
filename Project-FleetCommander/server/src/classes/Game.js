"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameList = exports.Game = exports.GameDelta = void 0;
const Player_1 = require("./Player");
const GameBoard_1 = require("./GameBoard");
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
        this.board = new GameBoard_1.Board();
        this.playerCount = 0;
        this.playerIds = [
            "Player1",
            "Player2",
            "Player3",
            "Player4"
        ];
        this.initPlayers();
        this.chatLog = [];
    }
    initPlayers() {
        this.players = new Map();
        this.playerIds.forEach((id) => {
            this.players.set(id, new Player_1.Player(id, this.board.territories.get(id)));
        });
        return;
    }
    /**
     * Still needs error checking.... Like the rest of the code..
     *
     */
    start() {
        let startGameData = {
            ships: [],
            scores: [],
            movePhase: "",
            board: "" //Currently unimplemented
        };
        startGameData.ships = this.initialShips();
        startGameData.scores = this.initialScores();
        startGameData.movePhase = this.initialMovePhase();
        return startGameData;
    }
    initialShips() {
        let initialShips = [];
        //At some point I need like a static game config class that has the playerId's, shipClasses, and shipId's
        //Then the const static data could be used here instead of constantly doing Object.keys()
        this.playerIds.forEach((playerId) => {
            Object.keys(this.players.get(playerId).fleet.ships).forEach((shipClass) => {
                Object.keys(this.players.get(playerId).fleet.ships[shipClass]).forEach((shipId) => {
                    initialShips.push({
                        playerId: playerId,
                        shipId: shipId,
                        shipClass: shipClass,
                        startLocation: this.players.get(playerId).fleet.ships[shipClass][shipId].position.coordinate
                    });
                });
            });
        });
        return initialShips;
    }
    initialScores() {
        let initialScores = [];
        this.playerIds.forEach((playerId) => {
            initialScores.push({
                playerId: playerId,
                score: 0
            });
        });
        return initialScores;
    }
    initialMovePhase() {
        return "pawn";
    }
    update() {
        let data = {
            spawns: [],
            moves: [],
            destroyed: [],
            scores: [],
            movePhase: ""
        };
        for (let i = 0; i < 11; i++) {
            this.playerIds.forEach((id) => {
                if (this.players.has(id)) {
                    this.players.get(id).incrementalUpdate();
                }
            });
        }
        this.playerIds.forEach((id) => {
            if (this.players.has(id)) {
                data.spawns = data.spawns.concat(this.players.get(id).updateData.spawns);
                data.moves = data.moves.concat(this.players.get(id).updateData.moves);
                data.destroyed = data.destroyed.concat(this.players.get(id).updateData.destroyed);
                data.scores = data.scores.concat(this.players.get(id).updateData.scores);
                data.movePhase = this.nextMovePhase();
            }
        });
        //-----This should be a useless call now...
        this.clearAllPlayerActions();
        //----
        return data;
    }
    nextMovePhase() {
        //move the move phase forward and return the new phase;
        return;
    }
    addPlayer(id, name) {
        this.players.get(id).connected = true;
        this.players.get(id).name = (name) ? name : id;
        this.playerCount++;
        return;
    }
    tryAddPlayer(playerName) {
        let firstAvailableId = this.getFirstAvailablePlayerSlot();
        playerName = (playerName) ? playerName : firstAvailableId;
        if (firstAvailableId) {
            this.addPlayer(firstAvailableId, playerName);
        }
        return (firstAvailableId) ? firstAvailableId : "";
    }
    /**
     * TODO
     */
    addSpectator() {
        //really just need to increment a counter
        //Spectators have no need for a data model
        return false;
    }
    removePlayer(id) {
        if (this.players.has(id)) {
            this.players.get(id).connected = false;
            this.playerCount--;
        }
        return;
    }
    /**
     * TODO
     */
    removeSpectator() {
        //just decrement the spectator counter
        return false;
    }
    getFirstAvailablePlayerSlot() {
        let firstAvailable = undefined;
        this.playerIds.forEach((id) => {
            if (this.players.has(id)) {
                if (!this.players.get(id).connected) {
                    firstAvailable = (firstAvailable) ? firstAvailable : id;
                }
            }
        });
        return firstAvailable;
    }
    readyPlayer(id) {
        if (this.players.has(id)) {
            this.players.get(id).setReady(true);
        }
        return;
    }
    allPlayersReady() {
        let allReady = true;
        this.playerIds.forEach((id) => {
            if (this.players.has(id) && !this.players.get(id).ready) {
                allReady = false;
            }
            else if (!this.players.has(id)) {
                allReady = false;
            }
        });
        return allReady;
    }
    submitPlayerActions(id, data) {
        if (this.players.has(id) && !this.players.get(id).actions) {
            this.players.get(id).actions = data;
        }
        return;
    }
    allPlayerActionsSubmitted() {
        let allSubmitted = true;
        this.playerIds.forEach((id) => {
            if (this.players.has(id) && !this.players.get(id).actions) {
                allSubmitted = false;
            }
            else if (!this.players.has(id)) {
                allSubmitted = false;
            }
        });
        return allSubmitted;
    }
    clearAllPlayerActions() {
        this.playerIds.forEach((id) => {
            if (this.players.has(id)) {
                this.players.get(id).actions = undefined;
            }
        });
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
        let startGameData = undefined;
        if (this.games[game]) {
            startGameData = this.games[game].start();
        }
        return startGameData;
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
    playerInGame(game, id) {
        return (this.games[game] && this.games[game].players.has(id) && this.games[game].players.get(id).connected) ? true : false;
    }
}
exports.GameList = GameList;
//# sourceMappingURL=Game.js.map