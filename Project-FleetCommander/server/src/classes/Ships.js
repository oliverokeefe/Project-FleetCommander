"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Flagship = exports.Command = exports.Knight = exports.Pawn = exports.Ship = exports.Fleet = exports.ShipList = void 0;
const GameBoard_1 = require("./GameBoard");
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
        this.ships = {
            pawn: {},
            knight: {},
            command: {},
            flagship: {}
        };
        this.spawnShipsIntoTerritory(territory);
        return;
    }
    spawnShipsIntoTerritory(territory) {
        if (territory.player) {
            territory.pawnStart.forEach((spawnTile, index) => {
                if (index < this.MAXPAWNS) {
                    this.ships.pawn[index] = new Pawn(index, territory.player, spawnTile);
                }
            });
            territory.knightStart.forEach((spawnTile, index) => {
                if (index < this.MAXKNIGHTS) {
                    this.ships.knight[index] = new Knight(index, territory.player, spawnTile);
                }
            });
            territory.commandStart.forEach((spawnTile, index) => {
                if (index < this.MAXCOMMAND) {
                    this.ships.command[index] = new Command(index, territory.player, spawnTile);
                }
            });
            territory.flagshipStart.forEach((spawnTile, index) => {
                if (index < this.MAXFLAGSHIPS) {
                    this.ships.flagship[index] = new Flagship(index, territory.player, spawnTile);
                }
            });
        }
        return;
    }
    clear() {
        Object.keys(this.ships).forEach((shipClass) => {
            Object.keys(this.ships[shipClass]).forEach((ship) => {
                if (this.ships[shipClass][ship]) {
                    this.ships[shipClass][ship].destroy();
                }
                this.ships[shipClass][ship] = undefined;
            });
        });
        return;
    }
}
exports.Fleet = Fleet;
class Ship {
    constructor(id, player, spawn) {
        this.id = id;
        this.player = player;
        this.globalId = `${this.player}:${this.id}`;
        this.position = undefined;
        this.spawn = spawn;
        this.value = 1;
        this.spawnShip();
    }
    putShipOnTile(tile) {
        tile.ships.add(this.globalId);
        this.position = tile;
        return;
    }
    removeShipFromBoard() {
        if (this.position) {
            this.position.ships.delete(this.globalId);
            this.position = undefined;
        }
        return;
    }
    move(tile) {
        if (this.validMove(tile.coordinate)) {
            this.putShipOnTile(tile);
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
            this.putShipOnTile(this.spawn);
        }
        return;
    }
    destroy(player) {
        if (player) {
            player.score += this.value;
        }
        this.removeShipFromBoard();
        return;
    }
    /**
     * TODO
     */
    tryCollectResource() {
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
        this.value = 2;
        this.shipClass = "knight";
    }
}
exports.Knight = Knight;
class Command extends Ship {
    constructor(id, player, spawn) {
        super(id, player, spawn);
        this.value = 3;
        this.shipClass = "command";
    }
}
exports.Command = Command;
class Flagship extends Ship {
    constructor(id, player, spawn) {
        super(id, player, spawn);
        this.value = 5;
        this.shipClass = "flagship";
    }
}
exports.Flagship = Flagship;
//# sourceMappingURL=Ships.js.map