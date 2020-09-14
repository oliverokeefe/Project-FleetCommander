"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameList = exports.Game = exports.GameDelta = void 0;
const Player_1 = require("./Player");
const GameBoard_1 = require("./GameBoard");
const Ships_1 = require("./Ships");
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
        this.movePhase = Ships_1.Fleet.SHIPCLASSES.PAWN;
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
            this.players.set(id, new Player_1.Player(id, this.board.territories.get(id), this.board));
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
        this.playerIds.forEach((playerId) => {
            this.players.get(playerId).fleet.ships.forEach((shipClass) => {
                shipClass.forEach((ship) => {
                    initialShips.push({
                        playerId: ship.playerId,
                        shipId: ship.id,
                        shipClass: ship.shipClass,
                        position: ship.position.rowcol
                    });
                });
            });
        });
        return initialShips;
    }
    initialScores() {
        let initialScores = [];
        this.players.forEach((player) => {
            initialScores.push({
                playerId: player.id,
                score: player.score
            });
        });
        return initialScores;
    }
    initialMovePhase() {
        return this.movePhase;
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
            this.players.forEach((player) => {
                player.incrementalUpdate(this.board, this.movePhase);
            });
        }
        this.players.forEach((player) => {
            if (player.updateData) {
                data.spawns = data.spawns.concat(player.updateData.spawns);
                data.moves = data.moves.concat(player.updateData.moves);
                data.destroyed = data.destroyed.concat(player.updateData.destroyed);
                data.scores = data.scores.concat(player.updateData.scores);
                player.updateData = undefined;
            }
        });
        data.movePhase = this.nextMovePhase();
        return data;
    }
    nextMovePhase() {
        switch (this.movePhase) {
            case (Ships_1.Fleet.SHIPCLASSES.PAWN): {
                this.movePhase = Ships_1.Fleet.SHIPCLASSES.KNIGHT;
                break;
            }
            case (Ships_1.Fleet.SHIPCLASSES.KNIGHT): {
                this.movePhase = Ships_1.Fleet.SHIPCLASSES.COMMAND;
                break;
            }
            case (Ships_1.Fleet.SHIPCLASSES.COMMAND): {
                this.movePhase = Ships_1.Fleet.SHIPCLASSES.FLAGSHIP;
                break;
            }
            case (Ships_1.Fleet.SHIPCLASSES.FLAGSHIP): {
                this.movePhase = Ships_1.Fleet.SHIPCLASSES.PAWN;
                break;
            }
            default: {
                this.movePhase = "ERROR";
                break;
            }
        }
        return this.movePhase;
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
            if (!data) {
                data = {
                    spawnAttempts: [],
                    moveAttempts: []
                };
            }
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