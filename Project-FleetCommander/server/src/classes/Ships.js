"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Movement = exports.Flagship = exports.Command = exports.Knight = exports.Pawn = exports.Ship = exports.Fleet = exports.ShipList = void 0;
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
    constructor(territory, board) {
        this.MAXPAWNS = 5;
        this.MAXKNIGHTS = 2;
        this.MAXCOMMAND = 1;
        this.MAXFLAGSHIPS = 1;
        this.ships = new Map();
        this.ships.set(Fleet.SHIPCLASSES.PAWN, new Map());
        this.ships.set(Fleet.SHIPCLASSES.KNIGHT, new Map());
        this.ships.set(Fleet.SHIPCLASSES.COMMAND, new Map());
        this.ships.set(Fleet.SHIPCLASSES.FLAGSHIP, new Map());
        this.spawnShipsIntoTerritory(territory, board);
        return;
    }
    spawnShipsIntoTerritory(territory, board) {
        if (territory.player) {
            territory.pawnStart.forEach((spawnTile, index) => {
                let id = index + "";
                let pawn = new Pawn(id, territory.player, spawnTile);
                this.ships.get(Fleet.SHIPCLASSES.PAWN).set(id, pawn);
                board.ships.set(pawn.globalId, pawn);
            });
            territory.knightStart.forEach((spawnTile, index) => {
                let id = index + "";
                let knight = new Knight(id, territory.player, spawnTile);
                this.ships.get(Fleet.SHIPCLASSES.KNIGHT).set(id, knight);
                board.ships.set(knight.globalId, knight);
            });
            territory.commandStart.forEach((spawnTile, index) => {
                let id = index + "";
                let command = new Command(id, territory.player, spawnTile);
                this.ships.get(Fleet.SHIPCLASSES.COMMAND).set(id, command);
                board.ships.set(command.globalId, command);
            });
            territory.flagshipStart.forEach((spawnTile, index) => {
                let id = index + "";
                let flagship = new Flagship(id, territory.player, spawnTile);
                this.ships.get(Fleet.SHIPCLASSES.FLAGSHIP).set(id, flagship);
                board.ships.set(flagship.globalId, flagship);
            });
        }
        return;
    }
    clear() {
        this.ships.forEach((shipClass) => {
            shipClass.forEach((ship) => {
                ship.destroy();
            });
        });
        return;
    }
}
exports.Fleet = Fleet;
///--------------------------------------------------
Fleet.SHIPCLASSES = {
    PAWN: "pawn",
    KNIGHT: "knight",
    COMMAND: "command",
    FLAGSHIP: "flagship"
};
class Ship {
    constructor(id, playerId, spawn, shipClass) {
        this.id = id;
        this.playerId = playerId;
        this.position = undefined;
        this.spawn = spawn;
        this.moveFinished = false;
        this.moveDelta = undefined;
        this.value = 1;
        this.shipClass = shipClass;
        this.globalId = Ship.globalId(this.playerId, this.shipClass, this.id);
        this.spawnShip();
    }
    static globalId(playerId, shipClass, shipId) {
        return `${playerId}:${shipClass}:${shipId}`;
    }
    static getPlayerFromGlobalId(globalId) {
        return globalId.split(":")[0];
    }
    placeShipOnTile(tile) {
        this.removeShipFromBoard();
        tile.ships.set(this.globalId, this);
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
    move(board, from, to) {
        let moveFinished = true;
        if (this.position) {
            let canReach = false;
            let battleState = this.position.getBattleState(this.playerId);
            if (!battleState.hasEnemeyShips) {
                canReach = this.canReach(to);
            }
            else {
                canReach = this.battleReach(to);
            }
            if (!(this.position.rowcol[0] === to[0] && this.position.rowcol[1] === to[1]) &&
                (board.validCoordinate(to) && battleState.shipDiff > -3 && canReach)) {
                let target = this.step(board, from, to);
                if (target) {
                    this.placeShipOnTile(target);
                    this.updateDelta(from);
                    if (this.position.rowcol[0] !== to[0] || this.position.rowcol[1] !== to[1]) {
                        moveFinished = false;
                    }
                }
            }
        }
        return moveFinished;
    }
    updateDelta(from) {
        if (!this.moveDelta) {
            this.moveDelta = {
                ship: {
                    playerId: this.playerId,
                    shipClass: this.shipClass,
                    shipId: this.id,
                    position: from
                },
                to: this.position.rowcol
            };
        }
        else {
            this.moveDelta.to = this.position.rowcol;
        }
        return;
    }
    step(board, from, to) { return Movement.step(board, to); }
    canReach(to) { return Movement.canReach(this, to); }
    battleStep(board, from, to) { return Movement.step(board, to); }
    battleReach(to) { return Movement.canReach(this, to); }
    spawnShip() {
        this.placeShipOnTile(this.spawn);
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
        super(id, player, spawn, Fleet.SHIPCLASSES.PAWN);
    }
}
exports.Pawn = Pawn;
class Knight extends Ship {
    constructor(id, player, spawn) {
        super(id, player, spawn, Fleet.SHIPCLASSES.KNIGHT);
        this.value = 2;
    }
    canReach(to) { return Movement.knightCanReach(this, to); }
}
exports.Knight = Knight;
class Command extends Ship {
    constructor(id, player, spawn) {
        super(id, player, spawn, Fleet.SHIPCLASSES.COMMAND);
        this.value = 3;
    }
    step(board, from, to) { return Movement.queenStep(this, board, from, to); }
    canReach(to) { return Movement.queenCanReach(this, to); }
}
exports.Command = Command;
class Flagship extends Ship {
    constructor(id, player, spawn) {
        super(id, player, spawn, Fleet.SHIPCLASSES.FLAGSHIP);
        this.value = 5;
    }
    step(board, from, to) { return Movement.queenStep(this, board, from, to); }
    canReach(to) { return Movement.queenCanReach(this, to); }
}
exports.Flagship = Flagship;
class Movement {
    static step(board, to) {
        let target = board.getTile(to);
        return target;
    }
    static queenStep(ship, board, from, to) {
        let target = undefined;
        let vector = [to[0] - from[0], to[1] - from[1]];
        if (vector[0] === 0 && vector[1] === 0) {
            return target;
        }
        let magnitude = (vector[0] !== 0) ? Math.abs(vector[0]) : Math.abs(vector[1]);
        let normalVector = [vector[0] / magnitude, vector[1] / magnitude];
        let targetCoord = [ship.position.rowcol[0] + normalVector[0], ship.position.rowcol[1] + normalVector[1]];
        if ((ship.position.rowcol[0] === from[0] && ship.position.rowcol[1] === from[1]) ||
            (ship.position.ships.size === 1)) {
            target = Movement.step(board, targetCoord);
        }
        return target;
    }
    static canReach(ship, to) {
        let vector = [to[0] - ship.position.rowcol[0], to[1] - ship.position.rowcol[1]];
        return ((-1 <= vector[0] && vector[0] <= 1) && (-1 <= vector[1] && vector[1] <= 1));
    }
    static knightCanReach(ship, to) {
        let vector = [to[0] - ship.position.rowcol[0], to[1] - ship.position.rowcol[1]];
        let knightCanReach = ((-2 === vector[0] || vector[0] === 2) && (-1 === vector[1] || vector[1] === 1)) ||
            ((-1 === vector[0] || vector[0] === 1) && (-2 === vector[1] || vector[1] === 2));
        return knightCanReach || Movement.canReach(ship, to);
    }
    static queenCanReach(ship, to) {
        let vector = [to[0] - ship.position.rowcol[0], to[1] - ship.position.rowcol[1]];
        return ((vector[0] === 0 || vector[1] === 0) ||
            (vector[0] === vector[1]) ||
            (vector[0] === -vector[1]));
    }
}
exports.Movement = Movement;
//# sourceMappingURL=Ships.js.map