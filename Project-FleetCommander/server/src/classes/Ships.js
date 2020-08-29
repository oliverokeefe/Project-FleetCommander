"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Flagship = exports.Command = exports.Knight = exports.Pawn = exports.Ship = exports.Fleet = exports.ShipList = void 0;
const GameBoard_1 = require("../../../shared/src/classes/GameBoard");
class ShipList {
    constructor() {
        this.ships = {};
    }
    tryAddShip(ship) {
        let success = false;
        if (!this.ships[ship.id]) {
            this.ships[ship.id] = ship;
            success = true;
        }
        return success;
    }
    removeShip(ship) {
        delete this.ships[ship.id];
    }
}
exports.ShipList = ShipList;
class Fleet {
    constructor(territory) {
        this.MAXPAWNS = 5;
        this.MAXKNIGHTS = 2;
        this.MAXCOMMAND = 1;
        this.MAXFLAGSHIPS = 1;
        return;
    }
    spawnShipsIntoTerritory(territory) {
        return;
    }
}
exports.Fleet = Fleet;
class Ship {
    constructor(id, player, spawn) {
        this.id = id;
        this.player = player;
        this.globalId = `${this.player}|${this.id}`;
        this.position = undefined;
        this.spawn = spawn;
        this.spawnShip();
    }
    move(tile) {
        if (this.validMove(tile.coordinate)) {
            this.position = tile;
        }
        return this.position;
    }
    validMove(coordinate) {
        return GameBoard_1.Board.validCoordinate(coordinate) && this.shipCanReach(coordinate);
    }
    shipCanReach(coordinate) {
        if ((this.position.coordinate[0] - 1 <= coordinate[0] && coordinate[0] <= this.position.coordinate[0] + 1) &&
            (this.position.coordinate[1] - 1 <= coordinate[1] && coordinate[1] <= this.position.coordinate[1] + 1)) {
            return true;
        }
        else {
            return false;
        }
    }
    spawnShip() {
        if (!this.position) {
            this.spawn.ships.add(this.globalId);
            this.position = this.spawn;
        }
        return;
    }
    destroy() {
        if (this.position) {
            this.position.ships.delete(this.globalId);
            this.position = undefined;
        }
        return;
    }
}
exports.Ship = Ship;
class Pawn extends Ship {
    constructor(id, player, spawn) {
        super(id, player, spawn);
        this.shipClass = "pawn";
    }
}
exports.Pawn = Pawn;
class Knight extends Ship {
    constructor(id, player, spawn) {
        super(id, player, spawn);
        this.shipClass = "knight";
    }
}
exports.Knight = Knight;
class Command extends Ship {
    constructor(id, player, spawn) {
        super(id, player, spawn);
        this.shipClass = "command";
    }
}
exports.Command = Command;
class Flagship extends Ship {
    constructor(id, player, spawn) {
        super(id, player, spawn);
        this.shipClass = "flagship";
    }
}
exports.Flagship = Flagship;
//# sourceMappingURL=Ships.js.map