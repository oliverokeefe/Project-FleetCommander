import { socket, Game } from './MainModel.js';
import { coordinate } from "../../../shared/src/types/types";
import { Ship, Pawn, Knight, Command, Flagship } from "./Ships.js";
import * as Delta from '../../../shared/src/classes/GameDelta.js';





export interface BattleState {
    shipDiff: number;
    hasEnemeyShips: boolean;
}



export class Tile {

    public displayElement: HTMLDivElement;
    public rowcol: coordinate;
    public ships: Map<string, Map<string, Ship>>;
    public stagedShips: Map<string, Ship>;

    constructor(display: HTMLDivElement, rowcol: coordinate) {
        this.displayElement = display;
        this.rowcol = rowcol;
        this.ships = new Map<string, Map<string, Ship>>();
        this.ships.set(Ship.SHIPCLASSES.PAWN, new Map<string, Pawn>());
        this.ships.set(Ship.SHIPCLASSES.KNIGHT, new Map<string, Knight>());
        this.ships.set(Ship.SHIPCLASSES.COMMAND, new Map<string, Command>());
        this.ships.set(Ship.SHIPCLASSES.FLAGSHIP, new Map<string, Flagship>());
        this.stagedShips = new Map<string, Ship>();

        this.setUpSocket();
        this.addEventHandlers();
        return;
    }

    private setUpSocket(): void {
        return;
    }

    private addEventHandlers(): void {
        this.displayElement.addEventListener('click', (event) => {
            event.stopPropagation();
            this.stageSelectedShip();
        });
        return;
    }

    public suggest(): void {
        this.displayElement.classList.add("suggested");
        return;
    }

    public clearSuggestion(): void {
        this.displayElement.classList.remove("suggested");
        return;
    }

    public stageSelectedShip(): void {
        if(Game.selectedShip && this.displayElement.classList.contains("suggested")){
            this.stageShip(Game.selectedShip);
        }
        Game.deselectShip();
        return;
    }

    public stageShip(ship: Ship): void {
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

    public removeStagedShip(ship: Ship): void {
        if(this.stagedShips.has(ship.globalId)){
            this.stagedShips.get(ship.globalId).shadow.removeShadowFromBoard();
            this.stagedShips.delete(ship.globalId)
        }
        return;
    }

    public shadowStagedShip(ship: Ship): void {
        ship.shadow.placeShadowOnTile(this);
        return;
    }

    public moveStagedShips(ship: Ship): void {
        this.stagedShips.forEach((ship: Ship) => {
            ship.placeShipOnTile(this);
        });
        this.stagedShips.clear();
        return;
    }

    public clearStagedShips(): void {
        this.stagedShips.clear();
        return;
    }

    /**
     * Returns the difference between given player's ships and the amount of
     * enemy ship and whether the tile contains hostile ships.
     * @param playerId 
     * @returns BattleState object containing the ship difference and whether the tile has enemy ships
     */
    public getBattleState(playerId: string): BattleState {
        let battleState: BattleState = {
            shipDiff: 0,
            hasEnemeyShips: false
        };
        this.ships.forEach((shipClass) => {
            shipClass.forEach((ship) => {
                if(ship.playerId === playerId) {
                    battleState.shipDiff++;
                } else {
                    battleState.shipDiff--;
                    battleState.hasEnemeyShips = true;
                }
            });
        });
        return battleState;
    }
}

export class Board {

    static readonly MAXROW: number = 10;
    static readonly MAXCOL: number = 10;

    public displayElement: HTMLDivElement;
    public tiles: Tile[][];
    public ships: Map<string, Ship>;
    public suggestedTiles: Tile[];

    constructor() {
        this.displayElement = document.getElementById("Gameboard") as HTMLDivElement;
        this.tiles = [];
        this.ships = new Map<string, Ship>();
        this.suggestedTiles = [];
        this.setUpSocket();
        this.addHanldersToElements();
        this.createBlankBoard();
        return;
    }

    public validCoordinate(coordinate: coordinate): boolean {
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
    
        this.tiles[row].push(new Tile(tile, [row,col]));
    
        return tile;
    }

    public start(data: Delta.InitialGameState): void {
        //spawn all the ships or something

        return;
    }

    public suggestTile(tile: Tile): void {
        if(tile){
            this.suggestedTiles.push(tile);
            tile.suggest();
        }
        return;
    }

    public clearSuggestions(): void {
        this.suggestedTiles.forEach((suggestedTile: Tile) => {
            suggestedTile.clearSuggestion();
        });
        this.suggestedTiles = [];
        return;
    }

    public getTile(coordinate: coordinate): Tile {
        let target: Tile = undefined
        if(this.validCoordinate(coordinate) && this.tiles[coordinate[0]]){
            target = this.tiles[coordinate[0]][coordinate[1]];
        }
        return target;
    }

}




