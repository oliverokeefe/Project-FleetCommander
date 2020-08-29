
import { coordinate } from '../../../shared/src/types/types';
import { Board, Tile, Territory } from '../../../shared/src/classes/GameBoard';


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

export class Fleet {

    ///--------------------------------------------------
    //These should later be part of a static 'game config' class
    //  the game config classes can then be used to select different game modes/number of players/ maps/ etc...
    readonly MAXPAWNS: number;
    readonly MAXKNIGHTS: number;
    readonly MAXCOMMAND: number;
    readonly MAXFLAGSHIPS: number;
    ///--------------------------------------------------

    public ships: {
        pawns: {
            [id: number]: Pawn
        },
        knights: {
            [id: number]: Knight
        },
        command: {
            [id: number]: Command
        },
        flagship: {
            [id: number]: Flagship
        }
    };

    constructor(territory: Territory) {
        this.MAXPAWNS = 5;
        this.MAXKNIGHTS = 2;
        this.MAXCOMMAND = 1;
        this.MAXFLAGSHIPS = 1;




        return;
    }

    private spawnShipsIntoTerritory(territory: Territory): void{
        


        return;
    }

}


export abstract class Ship {

    abstract readonly shipClass: string;


    public id: number;
    public player: string;
    public globalId: string;
    public position: Tile;
    public spawn: Tile

    constructor(id: number, player: string, spawn: Tile) {
        this.id = id;
        this.player = player;
        this.globalId = `${this.player}|${this.id}`;
        this.position = undefined;
        this.spawn = spawn;
        this.spawnShip();
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
        if ((this.position.coordinate[0] - 1 <= coordinate[0] && coordinate[0] <= this.position.coordinate[0] + 1) &&
            (this.position.coordinate[1] - 1 <= coordinate[1] && coordinate[1] <= this.position.coordinate[1] + 1)) {
            return true;
        } else {
            return false;
        }
    }

    public spawnShip(): void {
        if(!this.position){
            this.spawn.ships.add(this.globalId);
            this.position = this.spawn;
        }
        return;
    }

    public destroy(): void {
        if(this.position){
            this.position.ships.delete(this.globalId);
            this.position = undefined;
        }
        return;
    }

}



export class Pawn extends Ship {

    readonly shipClass: string

    constructor(id: number, player: string, spawn: Tile) {
        super(id, player, spawn);
        this.shipClass = "pawn";
    }


}

export class Knight extends Ship {

    readonly shipClass;

    constructor(id: number, player: string, spawn: Tile) {
        super(id, player, spawn);
        this.shipClass = "knight";
    }

}

export class Command extends Ship {

    readonly shipClass: string;

    constructor(id: number, player: string, spawn: Tile) {
        super(id, player, spawn);
        this.shipClass = "command";
    }

}

export class Flagship extends Ship {

    readonly shipClass;
        
    constructor(id: number, player: string, spawn: Tile) {
        super(id, player, spawn);
        this.shipClass = "flagship";
    }

}




