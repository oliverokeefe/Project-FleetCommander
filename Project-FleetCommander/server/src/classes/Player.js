"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const Ships_1 = require("./Ships");
class Player {
    constructor(id, territory, board, name) {
        this.id = id;
        this.name = (name) ? name : this.id;
        this.score = 5;
        this.setTerritory(territory, board);
        this.connected = false;
        this.ready = false;
        this.actions = undefined;
        this.shipsMoved = undefined;
        this.updateData = undefined;
    }
    setReady(readyState) {
        this.ready = readyState;
        return;
    }
    setTerritory(territory, board) {
        if (territory) {
            this.territory = territory;
            this.territory.player = this.id;
            this.fleet = new Ships_1.Fleet(this.territory, board);
        }
        else {
            this.territory = undefined;
        }
        return;
    }
    clear() {
        this.fleet.clear();
        this.territory = undefined;
        this.score = 0;
        this.ready = false;
        return;
    }
    incrementalUpdate(board, movePhase) {
        if (this.actions) {
            let movesFinished = this.updatePositions(board, movePhase);
            if (movesFinished && !this.updateData) {
                this.finalUpdate();
            }
        }
        return;
    }
    finalUpdate() {
        this.updateData = {
            spawns: [],
            moves: [],
            destroyed: [],
            scores: [],
            movePhase: ""
        };
        this.shipsMoved.forEach((ship) => {
            if (ship.moveDelta) {
                this.updateData.moves.push(ship.moveDelta);
                ship.moveDelta = undefined;
            }
        });
        //Fleet Supply for move phase ships
        this.updateSupply();
        //Score
        this.updateScore();
        //spawns
        this.spawnShips();
        this.actions = undefined;
        this.shipsMoved = undefined;
        return;
    }
    updatePositions(board, movePhase) {
        if (!this.shipsMoved) {
            this.shipsMoved = new Map();
        }
        let movesFinished = true;
        this.actions.moveAttempts.forEach((move) => {
            if (move.ship.playerId === this.id && move.ship.shipClass === movePhase) {
                let moveFinished = this.handleMove(move, board);
                if (!moveFinished) {
                    movesFinished = false;
                }
            }
        });
        return movesFinished;
    }
    handleMove(move, board) {
        let moveFinished = this.fleet.ships.get(move.ship.shipClass).get(move.ship.shipId).move(board, move.ship.position, move.to);
        if (moveFinished) {
            if (!this.shipsMoved.has(Ships_1.Ship.globalId(move.ship.playerId, move.ship.shipClass, move.ship.shipId))) {
                this.shipsMoved.set(Ships_1.Ship.globalId(move.ship.playerId, move.ship.shipClass, move.ship.shipId), this.fleet.ships.get(move.ship.shipClass).get(move.ship.shipId));
            }
        }
        return moveFinished;
    }
    updateSupply() {
        return;
    }
    updateScore() {
        return;
    }
    spawnShips() {
        return;
    }
    handleSpawn() {
        return;
    }
}
exports.Player = Player;
//# sourceMappingURL=Player.js.map