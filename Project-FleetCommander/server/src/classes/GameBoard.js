"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Board = exports.Tile = void 0;
class Tile {
    constructor(coordinate, value, cluster) {
        this.coordinate = coordinate;
        this.value = (value) ? value : 0;
        this.cluster = (cluster) ? cluster : 0;
    }
}
exports.Tile = Tile;
class Board {
    constructor() {
        this.board = undefined;
        this.createBoard();
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
                if (((row === 0 || row === 2) && col === 5) ||
                    (row === 1 && (col === 4 || col === 5 || col === 6))) {
                    this.board[row][col].value = 1;
                    this.board[row][col].cluster = 1;
                }
                else if (((row === 4 || row === 6) && col === 9) ||
                    (row === 5 && (col === 8 || col === 9 || col === 10))) {
                    this.board[row][col].value = 1;
                    this.board[row][col].cluster = 2;
                }
                else if (((row === 8 || row === 10) && col === 5) ||
                    (row === 9 && (col === 4 || col === 5 || col === 6))) {
                    this.board[row][col].value = 1;
                    this.board[row][col].cluster = 3;
                }
                else if (((row === 4 || row === 6) && col === 1) ||
                    (row === 5 && (col === 0 || col === 1 || col === 2))) {
                    this.board[row][col].value = 1;
                    this.board[row][col].cluster = 4;
                }
                else if ((row === 4 || row === 5 || row === 6) && (col === 4 || col === 5 || col === 6)) {
                    this.board[row][col].value = 1;
                    this.board[row][col].cluster = 5;
                }
            }
        }
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
}
exports.Board = Board;
Board.size = 11;
//# sourceMappingURL=GameBoard.js.map