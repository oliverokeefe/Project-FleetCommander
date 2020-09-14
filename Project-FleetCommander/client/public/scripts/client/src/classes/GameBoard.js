import { Game } from './MainModel.js';
import { Ship } from "./Ships.js";
export class Tile {
    constructor(display, rowcol) {
        this.displayElement = display;
        this.rowcol = rowcol;
        this.ships = new Map();
        this.ships.set(Ship.SHIPCLASSES.PAWN, new Map());
        this.ships.set(Ship.SHIPCLASSES.KNIGHT, new Map());
        this.ships.set(Ship.SHIPCLASSES.COMMAND, new Map());
        this.ships.set(Ship.SHIPCLASSES.FLAGSHIP, new Map());
        this.stagedShips = new Map();
        this.setUpSocket();
        this.addEventHandlers();
        return;
    }
    setUpSocket() {
        return;
    }
    addEventHandlers() {
        this.displayElement.addEventListener('click', (event) => {
            event.stopPropagation();
            this.stageSelectedShip();
        });
        return;
    }
    suggest() {
        this.displayElement.classList.add("suggested");
        return;
    }
    clearSuggestion() {
        this.displayElement.classList.remove("suggested");
        return;
    }
    stageSelectedShip() {
        if (Game.selectedShip && this.displayElement.classList.contains("suggested")) {
            this.stageShip(Game.selectedShip);
        }
        Game.deselectShip();
        return;
    }
    stageShip(ship) {
        this.stagedShips.set(ship.globalId, ship);
        ship.moveDelta = {
            ship: {
                playerId: ship.playerId,
                shipId: ship.id,
                shipClass: ship.shipClass,
                position: ship.position.rowcol,
            },
            to: this.rowcol
        };
        this.shadowStagedShip(ship);
        return;
    }
    removeStagedShip(ship) {
        if (this.stagedShips.has(ship.globalId)) {
            this.stagedShips.get(ship.globalId).shadow.removeShadowFromBoard();
            this.stagedShips.delete(ship.globalId);
        }
        return;
    }
    shadowStagedShip(ship) {
        ship.shadow.placeShadowOnTile(this);
        return;
    }
    moveStagedShips(ship) {
        this.stagedShips.forEach((ship) => {
            ship.placeShipOnTile(this);
        });
        this.stagedShips.clear();
        return;
    }
    clearStagedShips() {
        this.stagedShips.clear();
        return;
    }
    /**
     * Returns the difference between given player's ships and the amount of
     * enemy ship and whether the tile contains hostile ships.
     * @param playerId
     * @returns BattleState object containing the ship difference and whether the tile has enemy ships
     */
    getBattleState(playerId) {
        let battleState = {
            shipDiff: 0,
            hasEnemeyShips: false
        };
        this.ships.forEach((shipClass) => {
            shipClass.forEach((ship) => {
                if (ship.playerId === playerId) {
                    battleState.shipDiff++;
                }
                else {
                    battleState.shipDiff--;
                    battleState.hasEnemeyShips = true;
                }
            });
        });
        return battleState;
    }
}
export class Board {
    constructor() {
        this.displayElement = document.getElementById("Gameboard");
        this.tiles = [];
        this.ships = new Map();
        this.suggestedTiles = [];
        this.setUpSocket();
        this.addHanldersToElements();
        this.createBlankBoard();
        return;
    }
    validCoordinate(coordinate) {
        //Check if the coordinate exists on the game board
        return (0 <= coordinate[0] && coordinate[0] <= Board.MAXROW && 0 <= coordinate[1] && coordinate[1] <= Board.MAXCOL);
    }
    setUpSocket() {
        return;
    }
    addHanldersToElements() {
        return;
    }
    createBlankBoard() {
        for (let row = 0; row <= Board.MAXROW; row++) {
            this.displayElement.appendChild(this.createRow(row));
        }
        this.displayElement.classList.remove("nodisp");
        return;
    }
    createRow(row) {
        let rowDiv = document.createElement("div");
        let oddeven = (row % 2 === 0) ? "even" : "odd";
        rowDiv.classList.add("row", `r${row}`, oddeven);
        this.tiles.push([]);
        for (let col = 0; col <= Board.MAXCOL; col++) {
            rowDiv.appendChild(this.createTile(row, col));
        }
        return rowDiv;
    }
    createTile(row, col) {
        let tile = document.createElement("div");
        let oddeven = (col % 2 === 0) ? "even" : "odd";
        tile.classList.add("tile", `c${col}`, oddeven);
        tile.id = `r${row}c${col}`;
        this.tiles[row].push(new Tile(tile, [row, col]));
        return tile;
    }
    start(data) {
        //spawn all the ships or something
        return;
    }
    suggestTile(tile) {
        if (tile) {
            this.suggestedTiles.push(tile);
            tile.suggest();
        }
        return;
    }
    clearSuggestions() {
        this.suggestedTiles.forEach((suggestedTile) => {
            suggestedTile.clearSuggestion();
        });
        this.suggestedTiles = [];
        return;
    }
    getTile(coordinate) {
        let target = undefined;
        if (this.validCoordinate(coordinate) && this.tiles[coordinate[0]]) {
            target = this.tiles[coordinate[0]][coordinate[1]];
        }
        return target;
    }
}
Board.MAXROW = 10;
Board.MAXCOL = 10;
//# sourceMappingURL=GameBoard.js.map