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

export class Territory {

    /**
     * The player using this spawn
     */
    public player: string
    public pawnStart: Tile[];
    public knightStart: Tile[];
    public commandStart: Tile[];
    public flagshipStart: Tile[];
    public buildTiles: Tile[];


    constructor() {
        this.player = "";
        this.pawnStart = [];
        this.knightStart = [];
        this.commandStart = [];
        this.flagshipStart = [];
        this.buildTiles = [];
    }

}


export class Board {

    static readonly size: number = 11;

    public board: Array<Array<Tile>>;

    public territories: Territory[];

    constructor() {
        this.board = undefined;
        this.createBoard();
        this.createTerritories();
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

                if (((0 <= row && row <= 2) && col === 5) ||
                    (row === 1 && (4 <= col && col <= 6))) {
                    this.board[row][col].value = 1;
                    this.board[row][col].cluster = 1;

                } else if (((4 <= row && row <= 6) && col === 9) ||
                    (row === 5 && (8 <= col && col <= 10))) {
                    this.board[row][col].value = 1;
                    this.board[row][col].cluster = 2;

                } else if (((8 <= row && row <= 10) && col === 5) ||
                    (row === 9 && (4 <= col && col <= 6))) {
                    this.board[row][col].value = 1;
                    this.board[row][col].cluster = 3;

                } else if (((4 <= row && row <= 6) && col === 1) ||
                    (row === 5 && (0 <= col && col <= 2))) {
                    this.board[row][col].value = 1;
                    this.board[row][col].cluster = 4;

                } else if ((4 <= row && row <= 6) && (4 <= col && col <= 6)) {
                    this.board[row][col].value = 1;
                    this.board[row][col].cluster = 5;
                }

            }

        }
        return;
    }

    private createTerritories(): void {

        //Top Left
        let topLeft: Territory = new Territory();
        topLeft.pawnStart = [this.board[2][0], this.board[2][1], this.board[2][2], this.board[1][2], this.board[0][2]];
        topLeft.knightStart = [this.board[0][1], this.board[1][0]];
        topLeft.commandStart = [this.board[1][1]];
        topLeft.flagshipStart = [this.board[0][0]];
        topLeft.buildTiles = topLeft.pawnStart.concat(topLeft.knightStart, topLeft.commandStart, topLeft.flagshipStart);

        //Top Right
        let topRight: Territory = new Territory();
        topRight.pawnStart = [this.board[2][10], this.board[2][9], this.board[2][8], this.board[1][8], this.board[0][8]];
        topRight.knightStart = [this.board[0][9], this.board[1][10]];
        topRight.commandStart = [this.board[1][9]];
        topRight.flagshipStart = [this.board[0][10]];
        topRight.buildTiles = topRight.pawnStart.concat(topRight.knightStart, topRight.commandStart, topRight.flagshipStart);

        //Bottom Right
        let botRight: Territory = new Territory();
        botRight.pawnStart = [this.board[8][10], this.board[8][9], this.board[8][8], this.board[9][8], this.board[10][8]];
        botRight.knightStart = [this.board[10][9], this.board[9][10]];
        botRight.commandStart = [this.board[9][9]];
        botRight.flagshipStart = [this.board[10][10]];
        botRight.buildTiles = botRight.pawnStart.concat(botRight.knightStart, botRight.commandStart, botRight.flagshipStart);

        //Bottom Left
        let BotLeft: Territory = new Territory();
        BotLeft.pawnStart = [this.board[8][0], this.board[8][1], this.board[8][2], this.board[9][2], this.board[10][2]];
        BotLeft.knightStart = [this.board[9][0], this.board[10][1]];
        BotLeft.commandStart = [this.board[9][1]];
        BotLeft.flagshipStart = [this.board[10][0]];
        BotLeft.buildTiles = BotLeft.pawnStart.concat(BotLeft.knightStart, BotLeft.commandStart, BotLeft.flagshipStart);

        this.territories.push(topLeft, topRight, botRight, BotLeft);

        return;
    }


    public getTile(coordinate: coordinate): Tile {
        if (this.board && Board.validCoordinate(coordinate) && this.board[coordinate[0]] && this.board[coordinate[0]][coordinate[1]]) {
            return this.board[coordinate[0]][coordinate[1]];
        } else {
            return undefined;
        }
    }

}










