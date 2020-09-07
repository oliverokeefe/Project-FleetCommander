
import { socket, Game } from './MainModel.js';
import type { coordinate } from '../../../shared/src/types/types';
import { Board, Tile } from './GameBoard.js';
import * as Delta from '../../../shared/src/classes/GameDelta.js';

export class ShipList {

    public ships: {[id: number]: Ship};

    constructor() {
        this.ships = {};
    }

    public tryAddShip(ship: Ship): boolean{
        let success: boolean = false;
        if(!this.ships[ship.id]){
            this.ships[ship.id] = ship;
            success = true;
        }
        return success;
    }

    public removeShip(ship: Ship){
        delete this.ships[ship.id];
    }
}

export abstract class Ship {

    static readonly SHIPCLASSES = {
        PAWN: "pawn",
        KNIGHT: "knight",
        COMMAND: "command",
        FLAGSHIP: "flagship"
    }

    abstract readonly shipClass: string;
    abstract readonly globalId: string;


    public id: string;
    public playerId: string;
    public displayElement: HTMLDivElement;
    public position: Tile;
    public spawn: Tile;
    public battleCounter: number;
    public shadow: Shadow;
    public moveDelta: Delta.MoveDelta;

    constructor(id: string, player: string, spawnPosition: Tile) {
        this.id = id;
        this.playerId = player;
        this.displayElement = undefined;
        this.position = undefined;
        this.spawn = spawnPosition;
        this.battleCounter = 0;
        this.moveDelta = undefined;
        this.shadow = new Shadow(this);
    }

    public static globalId(playerId: string, shipClass: string, shipId: string): string {
        return `${playerId}:${shipClass}:${shipId}`;
    }

    public initShip(): void {
        this.createDisplay();
        this.addEventHandlers();
        this.spawnShip();
        return;
    }

    public createDisplay(): void {
        this.displayElement = document.createElement('div');
        this.displayElement.classList.add(this.playerId, "ship", this.shipClass);
        return;
    }

    public addEventHandlers(): void {
        this.displayElement.addEventListener('click', (event) => { 
            event.stopPropagation();
            this.selectShip();
        });
        this.displayElement.addEventListener('mouseenter', () => { this.highlightShip() });
        this.displayElement.addEventListener('mouseout', () => { this.removeHighlight() });
        return;
    }

    public highlightShip(): void {
        this.displayElement.classList.add("highlight");
        this.shadow.displayElement.classList.add("highlight");
        Game.ShipInfoDisplay.update(this);
        return;
    }

    public removeHighlight(): void {
        this.displayElement.classList.remove("highlight");
        this.shadow.displayElement.classList.remove("highlight");
        return;
    }

    public selectShip(): void {
        let lastSelectedShip: string = undefined;
        if(Game.selectedShip){
            lastSelectedShip = Game.selectedShip.globalId;
            this.position.stageSelectedShip();
        }
        if(this.playerId === Game.Player.id && this.shipClass === Game.movePhase && this.globalId !== lastSelectedShip){
            this.unstage();
            if(this.position){
                Game.selectedShip = this;
                this.suggestMoves();
            }
        }
        return;
    }

    public suggestMoves(): void {
        if(this.position){
            for(let rowMod = -1; rowMod <= 1; rowMod++){
                for(let colMod = -1; colMod <= 1; colMod++){
                    if(!(rowMod === 0 && colMod === 0)){
                        let curCoord: coordinate = [
                            this.position.rowcol[0]+rowMod,
                            this.position.rowcol[1]+colMod
                        ];
                        if(Board.validCoordinate(curCoord)){
                            Game.Board.suggestTile(Game.Board.tiles[curCoord[0]][curCoord[1]]);
                        }
                    }
                }
            }
        }
        return;
    }
    
    public unstage(): void {
        if(this.shadow.position){
            this.shadow.position.removeStagedShip(this);
        }
        this.moveDelta = undefined;
        return;
    }

    public shadowMove(): void {
        return;
    }

    public move(tile: Tile): Tile {
        if (this.validMove(tile.rowcol)) {
            this.position = tile;
        }

        return this.position;
    }

    public validMove(coordinate: coordinate): boolean {
        return Board.validCoordinate(coordinate) && this.shipCanReach(coordinate);
    }

    public shipCanReach(coordinate: coordinate): boolean {
        ///Somewhere in here should check if ship is being blocked
        if ((this.position.rowcol[0] - 1 <= coordinate[0] && coordinate[0] <= this.position.rowcol[0] + 1) &&
            (this.position.rowcol[1] - 1 <= coordinate[1] && coordinate[1] <= this.position.rowcol[1] + 1)) {
            return true;
        } else {
            return false;
        }
    }

    public getPossibleMoves(): coordinate[] {
        let viableMoves: coordinate[] = [];
        if(this.position){

            for(let rowMod = -1; rowMod <= 1; rowMod++){
                for(let colMod = -1; colMod <= 1; colMod++){
                    if(!(rowMod === 0 && colMod === 0)){
                        let curCoord: coordinate = [
                            this.position.rowcol[0]+rowMod,
                            this.position.rowcol[1]+colMod
                        ];
                        if(Board.validCoordinate(curCoord)){
                            viableMoves.push(curCoord);
                        }
                    }
                }
            }
        }
        return viableMoves;
    }

    public placeShipOnTile(tile: Tile): void {
        this.removeShipFromBoard();
        tile.ships.add(this.globalId);
        this.position = tile;
        tile.displayElement.appendChild(this.displayElement);
        return;
    }

    public removeShipFromBoard(): void {
        if(this.position){
            this.position.ships.delete(this.globalId);
            this.position.displayElement.removeChild(this.displayElement);
            this.position = undefined
        }
        return;
    }

    public spawnShip(): void {
        this.placeShipOnTile(this.spawn);
        return;
    }

}



export class Pawn extends Ship {

    readonly shipClass: string;
    readonly globalId: string;

    constructor(id: string, player: string, spawnPosition: Tile) {
        super(id, player, spawnPosition);
        this.shipClass = Ship.SHIPCLASSES.PAWN;
        this.globalId = Ship.globalId(this.playerId, this.shipClass, this.id);
        this.initShip();
    }
}

export class Knight extends Ship {

    readonly shipClass: string;
    readonly globalId: string;

    constructor(id: string, player: string, spawnPosition: Tile) {
        super(id, player, spawnPosition);
        this.shipClass = Ship.SHIPCLASSES.KNIGHT;
        this.globalId = Ship.globalId(this.playerId, this.shipClass, this.id);
        this.initShip();
    }

    public suggestMoves(): void {
        console.log("Suggest Moves??");

        if(this.position){
            let range: coordinate[] = [
                [-2,-1],
                [-2,1],
                [-1,-2],
                [-1,2],
                [1,-2],
                [1,2],
                [2,-1],
                [2,1],
            ];
            range.forEach((mod: coordinate) => {
                let curCoord: coordinate = [
                    this.position.rowcol[0]+mod[0],
                    this.position.rowcol[1]+mod[1]
                ];
                if(Board.validCoordinate(curCoord)){
                    Game.Board.suggestTile(Game.Board.tiles[curCoord[0]][curCoord[1]]);
                }

            });
        }
        return;
    }
}

export class Command extends Ship {

    readonly shipClass: string;
    readonly globalId: string;

    constructor(id: string, player: string, spawnPosition: Tile) {
        super(id, player, spawnPosition);
        this.shipClass = Ship.SHIPCLASSES.COMMAND;
        this.globalId = Ship.globalId(this.playerId, this.shipClass, this.id);
        this.initShip();
    }
}

export class Flagship extends Ship {

    readonly shipClass: string;
    readonly globalId: string;
       
    constructor(id: string, player: string, spawnPosition: Tile) {
        super(id, player, spawnPosition);
        this.shipClass = Ship.SHIPCLASSES.FLAGSHIP;
        this.globalId = Ship.globalId(this.playerId, this.shipClass, this.id);
        this.initShip();
    }
}




export class Shadow {

    readonly shipClass;
    public displayElement: HTMLDivElement;
    public owner: Ship;
    public position: Tile;

    constructor(owner: Ship) {
        this.displayElement = undefined;
        this.owner = owner;
        this.position = undefined;
        this.shipClass = "shadow";
        this.createDisplay();
        this.addEventHandlers();
    }

    public createDisplay(): void {
        this.displayElement = document.createElement('div');
        this.displayElement.classList.add(this.owner.playerId, "ship", this.shipClass);
        return;
    }

    public addEventHandlers(): void {
        this.displayElement.addEventListener('click', (event) => { 
            event.stopPropagation();
            this.cancelMove();
        });
        this.displayElement.addEventListener('mouseenter', () => { this.highlightShip() });
        this.displayElement.addEventListener('mouseout', () => { this.removeHighlight() });
        return;
    }

    public highlightShip(): void {
        this.displayElement.classList.add("highlight");
        this.owner.displayElement.classList.add("highlight");
        Game.ShipInfoDisplay.update(this.owner);
        return;
    }

    public removeHighlight(): void {
        this.displayElement.classList.remove("highlight");
        this.owner.displayElement.classList.remove("highlight");
        return;
    }

    public cancelMove(): void {
        this.owner.unstage();
        this.removeHighlight();
        return;
    }


    public placeShadowOnTile(tile: Tile): void {
        this.removeShadowFromBoard();
        this.position = tile;
        tile.displayElement.appendChild(this.displayElement);
        return;
    }

    public removeShadowFromBoard(): void {
        if(this.position){
            this.position.displayElement.removeChild(this.displayElement);
            this.position = undefined
        }
        return;
    }
}


