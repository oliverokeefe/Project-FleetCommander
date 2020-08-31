"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Board = exports.Territory = exports.Tile = void 0;
///--------------------------------------------------
// TODO Make a seperate server and client game board... this cannot be in shared...
///--------------------------------------------------
class Tile {
    constructor(coordinate, value, cluster) {
        this.coordinate = coordinate;
        this.value = (value) ? value : 0;
        this.cluster = (cluster) ? cluster : 0;
        this.territory = "";
        this.ships = new Set();
        this.ship = "";
        this.isSpawn = false;
        this.canBuildOn = false;
    }
}
exports.Tile = Tile;
class Territory {
    constructor() {
        this.player = "";
        this.pawnStart = [];
        this.knightStart = [];
        this.commandStart = [];
        this.flagshipStart = [];
        this.buildTiles = [];
    }
}
exports.Territory = Territory;
class Board {
    constructor() {
        this.board = undefined;
        this.createBoard();
        this.createTerritories();
    }
    static validCoordinate(coordinate) {
        //Check if the coordinate exists on the game board
        return (coordinate[0] >= 0 && coordinate[1] >= 0 && coordinate[0] < 11 && coordinate[1] < 11);
    }
    createBoard() {
        this.board = [];
        for (let row = 0; row < Board.size; row++) {
            this.board.push([]);
            for (let col = 0; col < Board.size; col++) {
                this.board[row].push(new Tile([row, col]));
                //Set point tiles and clusters
                if (((0 <= row && row <= 2) && col === 5) ||
                    (row === 1 && (4 <= col && col <= 6))) {
                    this.board[row][col].value = 1;
                    this.board[row][col].cluster = 1;
                }
                else if (((4 <= row && row <= 6) && col === 9) ||
                    (row === 5 && (8 <= col && col <= 10))) {
                    this.board[row][col].value = 1;
                    this.board[row][col].cluster = 2;
                }
                else if (((8 <= row && row <= 10) && col === 5) ||
                    (row === 9 && (4 <= col && col <= 6))) {
                    this.board[row][col].value = 1;
                    this.board[row][col].cluster = 3;
                }
                else if (((4 <= row && row <= 6) && col === 1) ||
                    (row === 5 && (0 <= col && col <= 2))) {
                    this.board[row][col].value = 1;
                    this.board[row][col].cluster = 4;
                }
                else if ((4 <= row && row <= 6) && (4 <= col && col <= 6)) {
                    this.board[row][col].value = 1;
                    this.board[row][col].cluster = 5;
                }
                //Set spawns, territories, and build tiles
                //Pawns
                if ((row === 2 && (0 <= col && col <= 2)) ||
                    ((0 <= row && row <= 2) && col === 2)) {
                    this.board[row][col].territory = "topLeft";
                    this.board[row][col].canBuildOn = true;
                    this.board[row][col].isSpawn = true;
                    this.board[row][col].ship = "pawn";
                }
                else if ((row === 2 && (8 <= col && col <= 10)) ||
                    ((0 <= row && row <= 2) && col === 8)) {
                    this.board[row][col].territory = "topRight";
                    this.board[row][col].canBuildOn = true;
                    this.board[row][col].isSpawn = true;
                    this.board[row][col].ship = "pawn";
                }
                else if ((row === 8 && (8 <= col && col <= 10)) ||
                    ((8 <= row && row <= 10) && col === 8)) {
                    this.board[row][col].territory = "botRight";
                    this.board[row][col].canBuildOn = true;
                    this.board[row][col].isSpawn = true;
                    this.board[row][col].ship = "pawn";
                }
                else if ((row === 8 && (0 <= col && col <= 2)) ||
                    ((8 <= row && row <= 10) && col === 2)) {
                    this.board[row][col].territory = "botLeft";
                    this.board[row][col].canBuildOn = true;
                    this.board[row][col].isSpawn = true;
                    this.board[row][col].ship = "pawn";
                }
                //Knights
                if ((row === 0 && col === 1) || (row === 1 && col === 0)) {
                    this.board[row][col].territory = "topLeft";
                    this.board[row][col].canBuildOn = true;
                    this.board[row][col].isSpawn = true;
                    this.board[row][col].ship = "knight";
                }
                else if ((row === 0 && col === 9) || (row === 1 && col === 10)) {
                    this.board[row][col].territory = "topRight";
                    this.board[row][col].canBuildOn = true;
                    this.board[row][col].isSpawn = true;
                    this.board[row][col].ship = "knight";
                }
                else if ((row === 10 && col === 9) || (row === 9 && col === 10)) {
                    this.board[row][col].territory = "botRight";
                    this.board[row][col].canBuildOn = true;
                    this.board[row][col].isSpawn = true;
                    this.board[row][col].ship = "knight";
                }
                else if ((row === 9 && col === 0) || (row === 10 && col === 1)) {
                    this.board[row][col].territory = "botLeft";
                    this.board[row][col].canBuildOn = true;
                    this.board[row][col].isSpawn = true;
                    this.board[row][col].ship = "knight";
                }
                //Command
                if (row === 1 && col === 1) {
                    this.board[row][col].territory = "topLeft";
                    this.board[row][col].canBuildOn = true;
                    this.board[row][col].isSpawn = true;
                    this.board[row][col].ship = "command";
                }
                else if (row === 1 && col === 9) {
                    this.board[row][col].territory = "topRight";
                    this.board[row][col].canBuildOn = true;
                    this.board[row][col].isSpawn = true;
                    this.board[row][col].ship = "command";
                }
                else if (row === 9 && col === 9) {
                    this.board[row][col].territory = "botRight";
                    this.board[row][col].canBuildOn = true;
                    this.board[row][col].isSpawn = true;
                    this.board[row][col].ship = "command";
                }
                else if (row === 9 && col === 1) {
                    this.board[row][col].territory = "botLeft";
                    this.board[row][col].canBuildOn = true;
                    this.board[row][col].isSpawn = true;
                    this.board[row][col].ship = "command";
                }
                //Flagship
                if (row === 0 && col === 0) {
                    this.board[row][col].territory = "topLeft";
                    this.board[row][col].canBuildOn = true;
                    this.board[row][col].isSpawn = true;
                    this.board[row][col].ship = "flagship";
                }
                else if (row === 0 && col === 10) {
                    this.board[row][col].territory = "topRight";
                    this.board[row][col].canBuildOn = true;
                    this.board[row][col].isSpawn = true;
                    this.board[row][col].ship = "flagship";
                }
                else if (row === 10 && col === 10) {
                    this.board[row][col].territory = "botRight";
                    this.board[row][col].canBuildOn = true;
                    this.board[row][col].isSpawn = true;
                    this.board[row][col].ship = "flagship";
                }
                else if (row === 10 && col === 0) {
                    this.board[row][col].territory = "botLeft";
                    this.board[row][col].canBuildOn = true;
                    this.board[row][col].isSpawn = true;
                    this.board[row][col].ship = "flagship";
                }
            }
        }
        return;
    }
    createTerritories() {
        this.territories = [];
        //Top Left
        let topLeft = new Territory();
        topLeft.pawnStart = [this.board[2][0], this.board[2][1], this.board[2][2], this.board[1][2], this.board[0][2]];
        topLeft.knightStart = [this.board[0][1], this.board[1][0]];
        topLeft.commandStart = [this.board[1][1]];
        topLeft.flagshipStart = [this.board[0][0]];
        topLeft.buildTiles = topLeft.pawnStart.concat(topLeft.knightStart, topLeft.commandStart, topLeft.flagshipStart);
        //Top Right
        let topRight = new Territory();
        topRight.pawnStart = [this.board[2][10], this.board[2][9], this.board[2][8], this.board[1][8], this.board[0][8]];
        topRight.knightStart = [this.board[0][9], this.board[1][10]];
        topRight.commandStart = [this.board[1][9]];
        topRight.flagshipStart = [this.board[0][10]];
        topRight.buildTiles = topRight.pawnStart.concat(topRight.knightStart, topRight.commandStart, topRight.flagshipStart);
        //Bottom Right
        let botRight = new Territory();
        botRight.pawnStart = [this.board[8][10], this.board[8][9], this.board[8][8], this.board[9][8], this.board[10][8]];
        botRight.knightStart = [this.board[10][9], this.board[9][10]];
        botRight.commandStart = [this.board[9][9]];
        botRight.flagshipStart = [this.board[10][10]];
        botRight.buildTiles = botRight.pawnStart.concat(botRight.knightStart, botRight.commandStart, botRight.flagshipStart);
        //Bottom Left
        let BotLeft = new Territory();
        BotLeft.pawnStart = [this.board[8][0], this.board[8][1], this.board[8][2], this.board[9][2], this.board[10][2]];
        BotLeft.knightStart = [this.board[9][0], this.board[10][1]];
        BotLeft.commandStart = [this.board[9][1]];
        BotLeft.flagshipStart = [this.board[10][0]];
        BotLeft.buildTiles = BotLeft.pawnStart.concat(BotLeft.knightStart, BotLeft.commandStart, BotLeft.flagshipStart);
        this.territories.push(topLeft, topRight, botRight, BotLeft);
        return;
    }
    getTile(coordinate) {
        if (this.board && Board.validCoordinate(coordinate) && this.board[coordinate[0]] && this.board[coordinate[0]][coordinate[1]]) {
            return this.board[coordinate[0]][coordinate[1]];
        }
        else {
            return undefined;
        }
    }
    toString() {
        let letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
        let boardAsString = "  | ";
        for (let colIndex = 0; colIndex < this.board.length; colIndex++) {
            boardAsString += (colIndex < 10) ? `${colIndex} | ` : `${colIndex}| `;
        }
        boardAsString += "\n----";
        for (let i = 0; i < this.board.length; i++) {
            boardAsString += `----`;
        }
        boardAsString += "\n";
        this.board.forEach((row, rowIndex) => {
            //boardAsString += (rowIndex < 10) ? ` ${rowIndex} | ` : `${rowIndex} | `;
            boardAsString += `${letters[rowIndex]} | `;
            row.forEach((tile) => {
                if (tile.isSpawn) {
                    switch (tile.ship) {
                        case ("pawn"):
                            boardAsString += ". | ";
                            break;
                        case ("knight"):
                            boardAsString += "* | ";
                            break;
                        case ("command"):
                            boardAsString += "+ | ";
                            break;
                        case ("flagship"):
                            boardAsString += "# | ";
                            break;
                        default:
                            boardAsString += "  | ";
                            break;
                    }
                }
                else if (tile.value > 0) {
                    boardAsString += `${tile.value} | `;
                }
                else {
                    boardAsString += "  | ";
                }
            });
            boardAsString += "\n----";
            for (let i = 0; i < this.board.length; i++) {
                boardAsString += `----`;
            }
            boardAsString += "\n";
        });
        return boardAsString;
    }
}
exports.Board = Board;
Board.size = 11;
//# sourceMappingURL=GameBoard.js.map