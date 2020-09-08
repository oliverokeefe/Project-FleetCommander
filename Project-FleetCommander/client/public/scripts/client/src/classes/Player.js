import * as Ship from "./Ships.js";
/*
 *
 * Keep track of player resources (ships, points)
 *
 * SENDS turn updates to server
 *
 */
export class Player {
    constructor(id, name) {
        this.id = id;
        this.name = (name) ? name : undefined;
        this.score = 0;
        this.ships = new Map();
        this.ships.set(Ship.Ship.SHIPCLASSES.PAWN, new Map());
        this.ships.set(Ship.Ship.SHIPCLASSES.KNIGHT, new Map());
        this.ships.set(Ship.Ship.SHIPCLASSES.COMMAND, new Map());
        this.ships.set(Ship.Ship.SHIPCLASSES.FLAGSHIP, new Map());
        this.setUpSocket();
    }
    setUpSocket() {
        return;
    }
    clearSocket() {
        return;
    }
    ready() {
        return;
    }
    hasShipAt(rowcol) {
        let hasShipAtRowCol = false;
        this.ships.forEach((shipClass) => {
            shipClass.forEach((ship) => {
                if (ship.position &&
                    ship.position.rowcol[0] === rowcol[0] &&
                    ship.position.rowcol[1] === rowcol[1]) {
                    hasShipAtRowCol = true;
                }
            });
        });
        return hasShipAtRowCol;
    }
}
//# sourceMappingURL=Player.js.map