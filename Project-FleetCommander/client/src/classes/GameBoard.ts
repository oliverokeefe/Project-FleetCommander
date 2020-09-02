import { coordinate } from "../../../shared/src/types/types";
import { Ship } from "./Ships.js";
import * as Delta from '../../../shared/src/classes/GameDelta.js';









export class Tile {

    public socket: SocketIOClient.Socket;
    public displayElement: HTMLDivElement;
    public coordinate: coordinate
    public ships: Set<string>;

    constructor(socket: SocketIOClient.Socket, display: HTMLDivElement, coordinate: coordinate) {
        this.socket = socket;
        this.displayElement = display;
        this.coordinate = coordinate;
        this.ships = new Set<string>();

        this.setUpSocket();
        this.addHanldersToElements();
        return;
    }

    private setUpSocket(): void {
        return;
    }

    private addHanldersToElements(): void {
        return;
    }
}

export class Board {

    static readonly MAXROW: number = 10;
    static readonly MAXCOL: number = 10;

    public socket: SocketIOClient.Socket;
    public displayElement: HTMLDivElement;
    public tiles: Tile[][];
    public ships: Map<string, Ship>;

    constructor(socket: SocketIOClient.Socket) {
        this.socket = socket;
        this.displayElement = document.getElementById("Gameboard") as HTMLDivElement;
        this.tiles = [];
        this.ships = new Map<string, Ship>();

        this.setUpSocket();
        this.addHanldersToElements();
        this.createBlankBoard();
        return;
    }

    public static validCoordinate(coordinate: coordinate): boolean {
        //Check if the coordinate exists on the game board

        return (0 <= coordinate[0] && coordinate[0] <= Board.MAXROW && 0 <= coordinate[1] && coordinate[1] <= Board.MAXCOL);
    }

    private setUpSocket(): void {
        return;
    }

    private addHanldersToElements(): void {
        return;
    }

    private createBlankBoard(): void {
        for (let row = 0; row <= Board.MAXROW; row++) {
            this.displayElement.appendChild(this.createRow(row));
        }
        this.displayElement.classList.remove("nodisp");
        return;
    }

    private createRow(row: number): HTMLDivElement {
        let rowDiv: HTMLDivElement = document.createElement("div") as HTMLDivElement;
        let oddeven = (row % 2 === 0) ? "even" : "odd";
        rowDiv.classList.add("row", `r${row}`, oddeven);
        this.tiles.push([]);
        for (let col = 0; col <= Board.MAXCOL; col++) {
            rowDiv.appendChild(this.createTile(row, col));
        }
        return rowDiv;
    }

    private createTile(row: number, col: number): HTMLDivElement {
        let tile: HTMLDivElement = document.createElement("div") as HTMLDivElement;
        let oddeven = (col % 2 === 0) ? "even" : "odd";
        tile.classList.add("tile", `c${col}`, oddeven);
        tile.id = `r${row}c${col}`;
    
        this.tiles[row].push(new Tile(this.socket, tile, [row,col]));
    
        return tile;
    }

    public start(data: Delta.InitialGameState): void {
        //spawn all the ships or something

        return;
    }

}




