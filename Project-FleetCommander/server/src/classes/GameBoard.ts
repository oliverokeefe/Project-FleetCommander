import { coordinate } from "../../../shared/src/types/types";


export class Tile {

    public coordinate: coordinate;
    public value: number;
    public cluster: number;


    constructor(coordinate: coordinate, value?: number, cluster?: number) {
        this.coordinate = coordinate;
        this.value = (value) ? value : 0;
        this.cluster = (cluster) ? cluster : 0;
    }

}

export class spawn {

    /**
     * The player using this spawn
     */
    public player: string
    public pawnStart: Tile[];
    public knightStart: Tile[];
    public commandStart: Tile[];
    public flagshipStart: Tile[];
    public rebuildStart: Tile[];


    constructor() {
        this.player = "";
    }

}


export class Board {

    static readonly size: number = 11;


    //spawn tiles

    public board: Array<Array<Tile>>;

    constructor() {
        this.board = undefined;
        this.createBoard();
    }

    public static validCoordinate(coordinate: coordinate): boolean {
        //Check if the coordinate exists on the game board

        return (coordinate[0] >= 0 && coordinate[1] >= 0 && coordinate[0] < 11 && coordinate[1] < 11);
    }

    private createBoard(): void {

        this.board = [];

        for (let row = 0; row < Board.size; row++) {
            this.board.push([]);
            for (let col = 0; col < Board.size; col++) {
                this.board[row].push(new Tile([row, col]));

                if (((row === 0 || row === 2) && col === 5) ||
                    (row === 1 && (col === 4 || col === 5 || col === 6))) {
                    this.board[row][col].value = 1;
                    this.board[row][col].cluster = 1;

                } else if (((row === 4 || row === 6) && col === 9) ||
                    (row === 5 && (col === 8 || col === 9 || col === 10))) {
                    this.board[row][col].value = 1;
                    this.board[row][col].cluster = 2;

                } else if (((row === 8 || row === 10) && col === 5) ||
                    (row === 9 && (col === 4 || col === 5 || col === 6))) {
                    this.board[row][col].value = 1;
                    this.board[row][col].cluster = 3;

                } else if (((row === 4 || row === 6) && col === 1) ||
                    (row === 5 && (col === 0 || col === 1 || col === 2))) {
                    this.board[row][col].value = 1;
                    this.board[row][col].cluster = 4;

                } else if ((row === 4 || row === 5 || row === 6) && (col === 4 || col === 5 || col === 6)) {
                    this.board[row][col].value = 1;
                    this.board[row][col].cluster = 5;
                }

            }

        }
        return;
    }


    public getTile(coordinate: coordinate): Tile {
        if (this.board && Board.validCoordinate(coordinate) && this.board[coordinate[0]] && this.board[coordinate[0]][coordinate[1]]) {
            return this.board[coordinate[0]][coordinate[1]];
        } else {
            return undefined;
        }
    }


    public toString(): string {

        let boardAsString = " T | ";

        for (let colIndex = 0; colIndex < this.board.length; colIndex++) {
            boardAsString += `${colIndex} | `;
        }

        boardAsString += "\n----";

        for (let i = 0; i < this.board.length; i++) {
            boardAsString += `----`;
        }
        boardAsString += "\n";

        this.board.forEach((row, rowIndex) => {
            boardAsString += (rowIndex < 10) ? ` ${rowIndex} | ` : `${rowIndex} | `;
            row.forEach((tile) => {
                boardAsString += (tile.value === 0) ? "  | " : `${tile.value} | `;
            });
            boardAsString += "\n----"
            for (let i = 0; i < this.board.length; i++) {
                boardAsString += `----`;
            }
            boardAsString += "\n";
        });

        return boardAsString;
    }

}










