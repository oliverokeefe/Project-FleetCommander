import { Board } from './GameBoard.js';
export class ShipList {
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
export class Ship {
    constructor(id, player, spawnPosition) {
        this.id = id;
        this.player = player;
        this.globalId = `${this.player}:${this.id}`;
        this.displayElement = undefined;
        this.position = undefined;
        this.spawn = spawnPosition;
        this.battleCounter = 0;
    }
    createDisplay() {
        this.displayElement = document.createElement('div');
        this.displayElement.classList.add(this.player, "ship", this.shipClass);
        return;
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
        ///Somewhere in here should check if ship is being blocked
        if ((this.position.coordinate[0] - 1 <= coordinate[0] && coordinate[0] <= this.position.coordinate[0] + 1) &&
            (this.position.coordinate[1] - 1 <= coordinate[1] && coordinate[1] <= this.position.coordinate[1] + 1)) {
            return true;
        }
        else {
            return false;
        }
    }
    placeShipOnTile(tile) {
        this.removeShipFromBoard();
        tile.ships.add(this.globalId);
        this.position = tile;
        tile.displayElement.appendChild(this.displayElement);
        return;
    }
    removeShipFromBoard() {
        if (this.position) {
            this.position.ships.delete(this.globalId);
            this.position.displayElement.removeChild(this.displayElement);
            this.position = undefined;
        }
        return;
    }
    spawnShip() {
        this.placeShipOnTile(this.spawn);
        return;
    }
}
Ship.SHIPCLASSES = {
    PAWN: "pawn",
    KNIGHT: "knight",
    COMMAND: "command",
    FLAGSHIP: "flagship"
};
export class Pawn extends Ship {
    constructor(id, player, spawnPosition) {
        super(id, player, spawnPosition);
        this.shipClass = Ship.SHIPCLASSES.PAWN;
        this.createDisplay();
        this.spawnShip();
    }
}
export class Knight extends Ship {
    constructor(id, player, spawnPosition) {
        super(id, player, spawnPosition);
        this.shipClass = Ship.SHIPCLASSES.KNIGHT;
        this.createDisplay();
        this.spawnShip();
    }
}
export class Command extends Ship {
    constructor(id, player, spawnPosition) {
        super(id, player, spawnPosition);
        this.shipClass = Ship.SHIPCLASSES.COMMAND;
        this.createDisplay();
        this.spawnShip();
    }
}
export class Flagship extends Ship {
    constructor(id, player, spawnPosition) {
        super(id, player, spawnPosition);
        this.shipClass = Ship.SHIPCLASSES.FLAGSHIP;
        this.createDisplay();
        this.spawnShip();
    }
}
//# sourceMappingURL=Ships.js.map