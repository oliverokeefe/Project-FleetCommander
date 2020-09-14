import { Game } from './MainModel.js';
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
    constructor(id, player, spawnPosition, shipClass) {
        this.id = id;
        this.playerId = player;
        this.displayElement = undefined;
        this.position = undefined;
        this.spawn = spawnPosition;
        this.supply = 0;
        this.moveDelta = undefined;
        this.shadow = new Shadow(this);
        this.shipClass = shipClass;
        this.globalId = Ship.globalId(this.playerId, this.shipClass, this.id);
        this.initShip();
    }
    static globalId(playerId, shipClass, shipId) {
        return `${playerId}:${shipClass}:${shipId}`;
    }
    initShip() {
        this.createDisplay();
        this.addEventHandlers();
        this.spawnShip();
        return;
    }
    createDisplay() {
        this.displayElement = document.createElement('div');
        this.displayElement.classList.add(this.playerId, "ship", this.shipClass);
        return;
    }
    addEventHandlers() {
        this.displayElement.addEventListener('click', (event) => {
            event.stopPropagation();
            this.selectShip();
        });
        this.displayElement.addEventListener('mouseenter', () => { this.highlightShip(); });
        this.displayElement.addEventListener('mouseout', () => { this.removeHighlight(); });
        return;
    }
    highlightShip() {
        this.displayElement.classList.add("highlight");
        this.shadow.displayElement.classList.add("highlight");
        Game.ShipInfoDisplay.update(this);
        return;
    }
    removeHighlight() {
        this.displayElement.classList.remove("highlight");
        this.shadow.displayElement.classList.remove("highlight");
        return;
    }
    selectShip() {
        let lastSelectedShip = undefined;
        if (Game.selectedShip) {
            lastSelectedShip = Game.selectedShip.globalId;
            this.position.stageSelectedShip();
        }
        if (this.playerId === Game.Player.id && this.shipClass === Game.movePhase && this.globalId !== lastSelectedShip) {
            this.unstage();
            Game.selectedShip = this;
            if (this.position) {
                let battleState = this.position.getBattleState(this.playerId);
                console.log(battleState);
                if (!battleState.hasEnemeyShips) {
                    this.suggestMoves();
                }
                else if (battleState.shipDiff > -3) {
                    this.suggestBattleMoves();
                }
                else {
                    //ship cannot move... do nothing??
                }
            }
        }
        return;
    }
    suggestBattleMoves() { Movement.suggestBasicMoves(this); }
    suggestMoves() { Movement.suggestBasicMoves(this); }
    unstage() {
        if (this.shadow.position) {
            this.shadow.position.removeStagedShip(this);
        }
        this.moveDelta = undefined;
        return;
    }
    shadowMove() {
        return;
    }
    placeShipOnTile(tile) {
        this.removeShipFromBoard();
        tile.ships.get(this.shipClass).set(this.globalId, this);
        this.position = tile;
        tile.displayElement.appendChild(this.displayElement);
        return;
    }
    removeShipFromBoard() {
        if (this.position) {
            this.shadow.removeShadowFromBoard();
            this.position.ships.get(this.shipClass).delete(this.globalId);
            this.position.displayElement.removeChild(this.displayElement);
            this.position = undefined;
        }
        return;
    }
    spawnShip() {
        this.placeShipOnTile(this.spawn);
        return;
    }
    /**
     * Only use to handle server updates. This will move the ship without any safety checks.
     * @param to coordinate of tile to move to
     */
    move(to) {
        //need to unstage the ship, clear any previous move data, and move the ship
        this.unstage();
        let target = Game.Board.getTile(to);
        if (target) {
            this.placeShipOnTile(target);
        }
        return;
    }
    tileHasDifferentShips(target) {
        let hasOtherShips = false;
        target.ships.forEach((ships, shipClass) => {
            if (shipClass !== this.shipClass && ships.size > 0) {
                hasOtherShips = true;
            }
        });
        return hasOtherShips;
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
        super(id, player, spawnPosition, Ship.SHIPCLASSES.PAWN);
    }
}
export class Knight extends Ship {
    constructor(id, player, spawnPosition) {
        super(id, player, spawnPosition, Ship.SHIPCLASSES.KNIGHT);
    }
    suggestMoves() { Movement.suggestKnightMoves(this); }
}
export class Command extends Ship {
    constructor(id, player, spawnPosition) {
        super(id, player, spawnPosition, Ship.SHIPCLASSES.COMMAND);
    }
    suggestMoves() { Movement.suggestQueenMoves(this); }
}
export class Flagship extends Ship {
    constructor(id, player, spawnPosition) {
        super(id, player, spawnPosition, Ship.SHIPCLASSES.FLAGSHIP);
    }
    suggestMoves() { Movement.suggestQueenMoves(this); }
}
export class Shadow {
    constructor(owner) {
        this.displayElement = undefined;
        this.owner = owner;
        this.position = undefined;
        this.shipClass = "shadow";
        this.createDisplay();
        this.addEventHandlers();
    }
    createDisplay() {
        this.displayElement = document.createElement('div');
        this.displayElement.classList.add(this.owner.playerId, "ship", this.shipClass);
        return;
    }
    addEventHandlers() {
        this.displayElement.addEventListener('click', (event) => {
            event.stopPropagation();
            this.cancelMove();
        });
        this.displayElement.addEventListener('mouseenter', () => { this.highlightShip(); });
        this.displayElement.addEventListener('mouseout', () => { this.removeHighlight(); });
        return;
    }
    highlightShip() {
        this.displayElement.classList.add("highlight");
        this.owner.displayElement.classList.add("highlight");
        Game.ShipInfoDisplay.update(this.owner);
        return;
    }
    removeHighlight() {
        this.displayElement.classList.remove("highlight");
        this.owner.displayElement.classList.remove("highlight");
        return;
    }
    cancelMove() {
        this.owner.unstage();
        this.removeHighlight();
        return;
    }
    placeShadowOnTile(tile) {
        this.removeShadowFromBoard();
        this.position = tile;
        tile.displayElement.appendChild(this.displayElement);
        return;
    }
    removeShadowFromBoard() {
        if (this.position) {
            this.position.displayElement.removeChild(this.displayElement);
            this.position = undefined;
        }
        return;
    }
}
export class Movement {
    static suggestBasicMoves(ship) {
        if (ship.position) {
            for (let rowMod = -1; rowMod <= 1; rowMod++) {
                for (let colMod = -1; colMod <= 1; colMod++) {
                    if (!(rowMod === 0 && colMod === 0)) {
                        let curCoord = [
                            ship.position.rowcol[0] + rowMod,
                            ship.position.rowcol[1] + colMod
                        ];
                        if (Game.Board.validCoordinate(curCoord)) {
                            Game.Board.suggestTile(Game.Board.tiles[curCoord[0]][curCoord[1]]);
                        }
                    }
                }
            }
        }
        return;
    }
    static suggestKnightMoves(ship) {
        if (ship.position) {
            let range = [
                [-2, -1],
                [-2, 1],
                [-1, -2],
                [-1, 2],
                [1, -2],
                [1, 2],
                [2, -1],
                [2, 1],
            ];
            range.forEach((mod) => {
                let curCoord = [
                    ship.position.rowcol[0] + mod[0],
                    ship.position.rowcol[1] + mod[1]
                ];
                if (Game.Board.validCoordinate(curCoord)) {
                    Game.Board.suggestTile(Game.Board.tiles[curCoord[0]][curCoord[1]]);
                }
            });
            Movement.suggestBasicMoves(ship);
        }
        return;
    }
    static suggestQueenMoves(ship) {
        if (ship.position) {
            let directions = [
                [-1, 0],
                [-1, 1],
                [0, 1],
                [1, 1],
                [1, 0],
                [1, -1],
                [0, -1],
                [-1, -1]
            ];
            directions.forEach((vector) => {
                let blocked = false;
                for (let mag = 1; mag <= 11; mag++) {
                    let curCoord = [
                        ship.position.rowcol[0] + vector[0] * mag,
                        ship.position.rowcol[1] + vector[1] * mag
                    ];
                    let target = Game.Board.getTile(curCoord);
                    if (target && !blocked) {
                        Game.Board.suggestTile(target);
                        blocked = ship.tileHasDifferentShips(target);
                    }
                }
            });
        }
        return;
    }
}
//# sourceMappingURL=Ships.js.map