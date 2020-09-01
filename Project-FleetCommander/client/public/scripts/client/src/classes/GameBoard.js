export class Tile {
    constructor(socket, display, coordinate) {
        this.socket = socket;
        this.displayElement = display;
        this.coordinate = coordinate;
        this.setUpSocket();
        this.addHanldersToElements();
        return;
    }
    setUpSocket() {
        return;
    }
    addHanldersToElements() {
        return;
    }
}
export class Board {
    constructor(socket) {
        this.socket = socket;
        this.displayElement = document.getElementById("Gameboard");
        this.tiles = [];
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
        this.tiles[row].push(new Tile(this.socket, tile, [row, col]));
        return tile;
    }
    start(data) {
        //spawn all the ships or something
        return;
    }
}
Board.MAXROW = 10;
Board.MAXCOL = 10;
//# sourceMappingURL=Gameboard.js.map