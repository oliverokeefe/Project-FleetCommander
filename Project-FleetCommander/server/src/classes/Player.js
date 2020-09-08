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
            if (!this.shipsMoved) {
                this.shipsMoved = new Map();
            }
            let movesFinished = true;
            this.actions.moveAttempts.forEach((move) => {
                if (move.playerId === this.id && move.shipClass === movePhase) {
                    let moveFinished = this.fleet.ships.get(move.shipClass).get(move.shipId).move(board, move.from, move.to);
                    if (moveFinished) {
                        if (!this.shipsMoved.has(Ships_1.Ship.globalId(move.playerId, move.shipClass, move.shipId))) {
                            this.shipsMoved.set(Ships_1.Ship.globalId(move.playerId, move.shipClass, move.shipId), this.fleet.ships.get(move.shipClass).get(move.shipId));
                        }
                    }
                    else {
                        movesFinished = false;
                    }
                }
            });
            if (movesFinished && !this.updateData) {
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
                //BC's
                //points
                //spawn
                this.actions = undefined;
                this.shipsMoved = undefined;
            }
        }
        return;
    }
}
exports.Player = Player;
//# sourceMappingURL=Player.js.map