import { coordinate } from "../../../shared/src/types/types";
import { defaultCoreCipherList } from "constants";



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


export class Grid {

    private size: number;

    public grid: Array<Array<Tile>>;

    constructor() {
        this.size = 11;
        this.grid = undefined;
        this.populateGrid();
    }

    public static validCoordinate(coordinate: coordinate): boolean {
        //Check if the coordinate exists on the game board

        return (coordinate[0] >= 0 && coordinate[1] >= 0 && coordinate[0] < 11 && coordinate[1] < 11);
    }

    private populateGrid(): void {

        this.grid = [];

        for (let row = 0; row < this.size; row++) {
            this.grid.push([]);
            for (let col = 0; col < this.size; col++) {
                this.grid[row].push(new Tile([row, col]));

                if (((row === 0 || row === 2) && col === 5) ||
                    (row === 1 && (col === 4 || col === 5 || col === 6))) {
                    this.grid[row][col].value = 1;
                    this.grid[row][col].cluster = 1;

                } else if (((row === 4 || row === 6) && col === 9) ||
                    (row === 5 && (col === 8 || col === 9 || col === 10))) {
                    this.grid[row][col].value = 1;
                    this.grid[row][col].cluster = 2;

                } else if (((row === 8 || row === 10) && col === 5) ||
                    (row === 9 && (col === 4 || col === 5 || col === 6))) {
                    this.grid[row][col].value = 1;
                    this.grid[row][col].cluster = 3;

                } else if (((row === 4 || row === 6) && col === 1) ||
                    (row === 5 && (col === 0 || col === 1 || col === 2))) {
                    this.grid[row][col].value = 1;
                    this.grid[row][col].cluster = 4;

                } else if ((row === 4 || row === 5 || row === 6) && (col === 4 || col === 5 || col === 6)) {
                    this.grid[row][col].value = 1;
                    this.grid[row][col].cluster = 5;
                }

            }

        }
        return;
    }


    public getTile(coordinate: coordinate): Tile {
        if (this.grid && Grid.validCoordinate(coordinate) && this.grid[coordinate[0]] && this.grid[coordinate[0]][coordinate[1]]) {
            return this.grid[coordinate[0]][coordinate[1]];
        } else {
            return undefined;
        }
    }

}










