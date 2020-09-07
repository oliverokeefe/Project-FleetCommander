import { Game } from './MainModel.js';
export class Tile {
    constructor(display, rowcol) {
        this.displayElement = display;
        this.rowcol = rowcol;
        this.ships = new Set();
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
            playerId: ship.playerId,
            shipId: ship.id,
            from: ship.position.rowcol,
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
    static validCoordinate(coordinate) {
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
}
Board.MAXROW = 10;
Board.MAXCOL = 10;
//# sourceMappingURL=GameBoard.js.map