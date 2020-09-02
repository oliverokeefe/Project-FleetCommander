
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


    public id: string;
    public player: string;
    public globalId: string;
    public displayElement: HTMLDivElement;
    public position: Tile;
    public spawn: Tile;
    public battleCounter: number;

    constructor(id: string, player: string, spawnPosition: Tile) {
        this.id = id;
        this.player = player;
        this.globalId = `${this.player}:${this.id}`;
        this.displayElement = undefined;
        this.position = undefined;
        this.spawn = spawnPosition;
        this.battleCounter = 0;
    }

    public createDisplay(): void {
        this.displayElement = document.createElement('div');
        this.displayElement.classList.add(this.player, "ship", this.shipClass);
        return;
    }

    public move(tile: Tile): Tile {
        if (this.validMove(tile.coordinate)) {
            this.position = tile;
        }

        return this.position;
    }

    public validMove(coordinate: coordinate): boolean {
        return Board.validCoordinate(coordinate) && this.shipCanReach(coordinate);
    }

    public shipCanReach(coordinate: coordinate): boolean {
        ///Somewhere in here should check if ship is being blocked
        if ((this.position.coordinate[0] - 1 <= coordinate[0] && coordinate[0] <= this.position.coordinate[0] + 1) &&
            (this.position.coordinate[1] - 1 <= coordinate[1] && coordinate[1] <= this.position.coordinate[1] + 1)) {
            return true;
        } else {
            return false;
        }
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

    readonly shipClass: string

    constructor(id: string, player: string, spawnPosition: Tile) {
        super(id, player, spawnPosition);
        this.shipClass = Ship.SHIPCLASSES.PAWN;
        this.createDisplay();
        this.spawnShip();
    }
}

export class Knight extends Ship {

    readonly shipClass;

    constructor(id: string, player: string, spawnPosition: Tile) {
        super(id, player, spawnPosition);
        this.shipClass = Ship.SHIPCLASSES.KNIGHT;
        this.createDisplay();
        this.spawnShip();
    }
}

export class Command extends Ship {

    readonly shipClass: string;

    constructor(id: string, player: string, spawnPosition: Tile) {
        super(id, player, spawnPosition);
        this.shipClass = Ship.SHIPCLASSES.COMMAND;
        this.createDisplay();
        this.spawnShip();
    }
}

export class Flagship extends Ship {

    readonly shipClass;
        
    constructor(id: string, player: string, spawnPosition: Tile) {
        super(id, player, spawnPosition);
        this.shipClass = Ship.SHIPCLASSES.FLAGSHIP;
        this.createDisplay();
        this.spawnShip();
    }
}




