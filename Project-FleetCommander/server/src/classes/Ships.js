"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Flagship = exports.Command = exports.Knight = exports.Pawn = exports.Ship = void 0;
const GameBoard_1 = require("./GameBoard");
class Ship {
    constructor(id) {
        this.id = id;
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
}
exports.Ship = Ship;
class Pawn extends Ship {
    constructor(id) {
        super(id);
        this.shipClass = "pawn";
    }
}
exports.Pawn = Pawn;
class Knight extends Ship {
    constructor(id) {
        super(id);
        this.shipClass = "knight";
    }
}
exports.Knight = Knight;
class Command extends Ship {
    constructor(id) {
        super(id);
        this.shipClass = "command";
    }
}
exports.Command = Command;
class Flagship extends Ship {
    constructor(id) {
        super(id);
        this.shipClass = "flagship";
    }
}
exports.Flagship = Flagship;
//# sourceMappingURL=Ships.js.map