import { Board } from './GameBoard.js';
//***** Client ships
/*
 * Client side ship data
 *
 * Handles ship display,
 *  ship movement,
 *  click events on the ships (show ships that can move this turn, show valid moves)
 *
 * ignore building ships for now
 */
export class Ship {
    constructor(id) {
        this.id = id;
        this.shipDisplay = undefined;
    }
    move(tile) {
        if (this.validMove(tile.coordinate)) {
            this.position = tile;
        }
        return this.position;
    }
    validMove(coordinate) {
        return Board.validCoordinate(coordinate) && this.shipCanReach(coordinate);
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
export class Pawn extends Ship {
    constructor(id) {
        super(id);
        this.shipClass = "pawn";
    }
}
export class Knight extends Ship {
    constructor(id) {
        super(id);
        this.shipClass = "knight";
    }
}
export class Command extends Ship {
    constructor(id) {
        super(id);
        this.shipClass = "command";
    }
}
export class Flagship extends Ship {
    constructor(id) {
        super(id);
        this.shipClass = "flagship";
    }
}
//# sourceMappingURL=Ships.js.map