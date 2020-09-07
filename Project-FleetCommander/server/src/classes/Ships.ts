
import { coordinate } from '../../../shared/src/types/types';
import { Board, Tile, Territory } from './GameBoard';
import { Player } from './Player';


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
        pawn: {
            [id: number]: Pawn
        },
        knight: {
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

        this.ships = {
            pawn: {},
            knight: {},
            command: {},
            flagship: {}
        };

        this.spawnShipsIntoTerritory(territory);
        return;
    }

    private spawnShipsIntoTerritory(territory: Territory): void{
        if(territory.player){
            territory.pawnStart.forEach((spawnTile: Tile, index: number) => {
                if(index < this.MAXPAWNS){
                    this.ships.pawn[index] = new Pawn(index, territory.player, spawnTile);
                }
            });
            territory.knightStart.forEach((spawnTile: Tile, index: number) => {
                if(index < this.MAXKNIGHTS){
                    this.ships.knight[index] = new Knight(index, territory.player, spawnTile);
                }
            });
            territory.commandStart.forEach((spawnTile: Tile, index: number) => {
                if(index < this.MAXCOMMAND){
                    this.ships.command[index] = new Command(index, territory.player, spawnTile);
                }
            });
            territory.flagshipStart.forEach((spawnTile: Tile, index: number) => {
                if(index < this.MAXFLAGSHIPS){
                    this.ships.flagship[index] = new Flagship(index, territory.player, spawnTile);
                }
            });
        }
        return;
    }

    public clear(): void {

        Object.keys(this.ships).forEach((shipClass) => {
            Object.keys(this.ships[shipClass]).forEach((ship) => {
                if(this.ships[shipClass][ship]){
                    (this.ships[shipClass][ship] as Ship).destroy();
                }
                this.ships[shipClass][ship] = undefined
            });
        });

        return;
    }

}


export abstract class Ship {

    abstract readonly shipClass: string;
    abstract readonly globalId: string;

    public id: number;
    public player: string;
    public position: Tile;
    public spawn: Tile;
    public value: number;
    public moveFinished: boolean;

    constructor(id: number, player: string, spawn: Tile) {
        this.id = id;
        this.player = player;
        this.position = undefined;
        this.spawn = spawn;
        this.moveFinished = false;
        this.value = 1;
        this.spawnShip();
    }

    private placeShipOnTile(tile: Tile): void {
        this.removeShipFromBoard();
        tile.ships.add(this.globalId);
        this.position = tile;
        return;
    }

    private removeShipFromBoard(): void {
        if(this.position){
            this.position.ships.delete(this.globalId);
            this.position = undefined;
        }
        return;
    }


    public move(tile: Tile): Tile {
        if (this.validMove(tile.coordinate)) {
            this.placeShipOnTile(tile);
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
        this.placeShipOnTile(this.spawn);
        return;
    }

    public destroy(player?: Player): void {
        if(player){
            player.score += this.value;
        }
        this.removeShipFromBoard();
        return;
    }

    /**
     * TODO
     */
    public tryCollectResource(): void {
        return;
    }

}



export class Pawn extends Ship {

    readonly shipClass: string
    readonly globalId: string;

    constructor(id: number, player: string, spawn: Tile) {
        super(id, player, spawn);
        this.shipClass = "pawn";
        this.globalId = `${this.player}:${this.shipClass}:${this.id}`;
    }


}

export class Knight extends Ship {

    readonly shipClass: string;
    readonly globalId: string;

    constructor(id: number, player: string, spawn: Tile) {
        super(id, player, spawn);
        this.value = 2;
        this.shipClass = "knight";
        this.globalId = `${this.player}:${this.shipClass}:${this.id}`;
    }

}

export class Command extends Ship {

    readonly shipClass: string;
    readonly globalId: string;

    constructor(id: number, player: string, spawn: Tile) {
        super(id, player, spawn);
        this.value = 3;
        this.shipClass = "command";
        this.globalId = `${this.player}:${this.shipClass}:${this.id}`;
    }

}

export class Flagship extends Ship {

    readonly shipClass: string;
    readonly globalId: string;

    constructor(id: number, player: string, spawn: Tile) {
        super(id, player, spawn);
        this.value = 5;
        this.shipClass = "flagship";
        this.globalId = `${this.player}:${this.shipClass}:${this.id}`;
    }

}




