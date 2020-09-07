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
}
//# sourceMappingURL=Player.js.map